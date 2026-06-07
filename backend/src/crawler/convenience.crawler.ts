import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { classifyCategory, parseKoreanDate } from './utils/normalize';
import { RawSnack } from './rss.crawler';

interface ConvenienceSource {
  brand: string;
  url: string;
  itemSelector: string;
  nameSelector: string;
  priceSelector?: string;
  imageSelector?: string;
  dateSelector?: string;
}

const SOURCES: ConvenienceSource[] = [
  {
    brand: 'GS25',
    url: 'https://www.gs25.com/store/product/all.do?pageNum=1&pageSize=20&searchKey=&searchValue=&ctg1Cd=&ctg2Cd=&ctg3Cd=&ctg4Cd=&orderBy=recent',
    itemSelector: '.prod_list li',
    nameSelector: '.prod_name',
    priceSelector: '.prod_price',
    imageSelector: 'img',
  },
  {
    brand: 'CU',
    url: 'https://cu.bgfretail.com/product/product.do?category=BFEF01&dispCatCd=001&depth=3',
    itemSelector: '.prod_list .prod_item',
    nameSelector: '.name',
    priceSelector: '.price',
    imageSelector: 'img',
  },
  {
    brand: '세븐일레븐',
    url: 'https://www.7-eleven.co.kr/product/bestWord.asp?intPageSize=20&strType=new',
    itemSelector: '.list_type2 li',
    nameSelector: '.tit',
    priceSelector: '.price',
    imageSelector: 'img',
  },
  {
    brand: '이마트24',
    url: 'https://emart24.co.kr/goods/list?page=1&cate_code=&brand_code=&sort_code=11',
    itemSelector: '.goods_list li',
    nameSelector: '.goods_name',
    priceSelector: '.goods_price',
    imageSelector: 'img',
  },
];

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable()
export class ConvenienceCrawler {
  private readonly logger = new Logger(ConvenienceCrawler.name);

  async crawl(): Promise<RawSnack[]> {
    const results: RawSnack[] = [];

    for (const source of SOURCES) {
      try {
        const snacks = await this.crawlSource(source);
        results.push(...snacks);
        await this.delay(500);
      } catch (e) {
        this.logger.warn(`Convenience crawl failed: ${source.brand} — ${(e as Error).message}`);
      }
    }

    return results;
  }

  private async crawlSource(source: ConvenienceSource): Promise<RawSnack[]> {
    const html = await this.fetchWithTimeout(source.url);
    const $ = cheerio.load(html);
    const results: RawSnack[] = [];

    $(source.itemSelector).each((_, el) => {
      try {
        const name = $(el).find(source.nameSelector).text().trim();
        if (!name || name.length < 2) return;

        const priceText = source.priceSelector ? $(el).find(source.priceSelector).text() : '';
        const price = this.parsePrice(priceText);

        const rawSrc = source.imageSelector
          ? $(el).find(source.imageSelector).attr('src') ?? $(el).find(source.imageSelector).attr('data-src')
          : undefined;
        const imageUrl = rawSrc
          ? rawSrc.startsWith('http') ? rawSrc : `https://${new URL(source.url).hostname}${rawSrc}`
          : undefined;

        const dateText = source.dateSelector ? $(el).find(source.dateSelector).text() : '';
        const releaseDate = parseKoreanDate(dateText) ?? new Date();

        if (Date.now() - releaseDate.getTime() > THREE_MONTHS_MS) return;

        results.push({
          name,
          brand: source.brand,
          category: classifyCategory(name),
          price,
          imageUrl,
          releaseDate,
        });
      } catch {
        // skip individual item errors
      }
    });

    return results;
  }

  private parsePrice(text: string): number | undefined {
    const m = text.replace(/,/g, '').match(/\d+/);
    return m ? parseInt(m[0], 10) : undefined;
  }

  private async fetchWithTimeout(url: string, timeoutMs = 10000): Promise<string> {
    const res = await axios.get(url, {
      timeout: timeoutMs,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YumYumBot/1.0)' },
    });
    return res.data as string;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
