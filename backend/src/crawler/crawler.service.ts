import { Injectable, Logger } from '@nestjs/common';
import cron from 'node-cron';
import { PrismaService } from '../prisma/prisma.service';
import { RssCrawler, RawSnack } from './rss.crawler';
import { NewsCrawler } from './news.crawler';
import { ConvenienceCrawler } from './convenience.crawler';
import { normalize, isSimilar, normalizeBrand } from './utils/normalize';

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rssCrawler: RssCrawler,
    private readonly newsCrawler: NewsCrawler,
    private readonly convenienceCrawler: ConvenienceCrawler,
  ) {
    // 매일 오전 9시 실행
    cron.schedule('0 9 * * *', () => {
      void this.runCollection();
    });
    this.logger.log('Crawler scheduled: 0 9 * * *');
  }

  async runCollection(): Promise<void> {
    this.logger.log('크롤링 시작...');

    const rawResults = await Promise.allSettled([
      this.rssCrawler.crawl(),
      this.newsCrawler.crawl(),
      this.convenienceCrawler.crawl(),
    ]);

    const allSnacks: RawSnack[] = [];
    for (const result of rawResults) {
      if (result.status === 'fulfilled') {
        allSnacks.push(...result.value);
      } else {
        this.logger.warn(`크롤러 오류: ${(result.reason as Error).message}`);
      }
    }

    this.logger.log(`총 ${allSnacks.length}개 후보 수집됨`);

    const deduped = this.deduplicate(allSnacks);
    this.logger.log(`중복 제거 후 ${deduped.length}개`);

    let saved = 0;
    for (const snack of deduped) {
      try {
        await this.saveSnack(snack);
        saved++;
      } catch (e) {
        this.logger.warn(`저장 실패: ${snack.name} — ${(e as Error).message}`);
      }
    }

    this.logger.log(`크롤링 완료: ${saved}개 저장`);
  }

  private deduplicate(snacks: RawSnack[]): RawSnack[] {
    const seen: string[] = [];
    return snacks.filter((s) => {
      const key = normalize(s.name);
      if (seen.some((k) => isSimilar(k, key))) return false;
      seen.push(key);
      return true;
    });
  }

  private async saveSnack(raw: RawSnack): Promise<void> {
    if (!raw.name || raw.name.length < 2) return;

    const releaseDate = raw.releaseDate ?? new Date();
    if (Date.now() - releaseDate.getTime() > THREE_MONTHS_MS) return;

    const brandName = normalizeBrand(raw.brand);

    const brand = await this.prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    const category = await this.prisma.category.upsert({
      where: { name: raw.category },
      update: {},
      create: { name: raw.category },
    });

    await this.prisma.snack.upsert({
      where: { name_brandId: { name: raw.name, brandId: brand.id } },
      update: {
        description: raw.description,
        price: raw.price,
        releaseDate,
        imageUrl: raw.imageUrl,
        categoryId: category.id,
      },
      create: {
        name: raw.name,
        brandId: brand.id,
        categoryId: category.id,
        description: raw.description,
        price: raw.price,
        releaseDate,
        imageUrl: raw.imageUrl,
      },
    });
  }
}
