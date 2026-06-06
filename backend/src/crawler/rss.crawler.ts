import { Injectable, Logger } from '@nestjs/common';
import Parser from 'rss-parser';
import { classifyCategory, normalizeBrand, parseKoreanDate } from './utils/normalize';

export interface RawSnack {
  name: string;
  brand: string;
  category: string;
  description?: string;
  releaseDate?: Date;
  imageUrl?: string;
  price?: number;
}

const RSS_FEEDS = [
  {
    url: 'https://www.thinkfood.co.kr/rss/allArticle.xml',
    brand: null,
  },
];

const BRAND_KEYWORDS = ['농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '해태', 'GS25', 'CU', '세븐일레븐', '이마트24'];
const NEW_PRODUCT_KEYWORDS = ['신제품', '출시', '런칭', '신상', '새롭게', '새로운'];

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable()
export class RssCrawler {
  private readonly logger = new Logger(RssCrawler.name);
  private readonly parser = new Parser({ timeout: 10000 });

  async crawl(): Promise<RawSnack[]> {
    const results: RawSnack[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const parsed = await this.parser.parseURL(feed.url);
        for (const item of parsed.items ?? []) {
          if (!this.isNewProduct(item.title ?? '')) continue;

          const releaseDate = item.pubDate ? new Date(item.pubDate) : undefined;
          if (releaseDate && Date.now() - releaseDate.getTime() > THREE_MONTHS_MS) continue;

          const brand = feed.brand ?? this.extractBrand(item.title + ' ' + (item.contentSnippet ?? ''));
          if (!brand) continue;

          const snack: RawSnack = {
            name: this.extractProductName(item.title ?? ''),
            brand: normalizeBrand(brand),
            category: classifyCategory(item.title ?? ''),
            description: item.contentSnippet?.slice(0, 300),
            releaseDate,
          };

          if (snack.name) results.push(snack);
        }
      } catch (e) {
        this.logger.warn(`RSS feed failed: ${feed.url} — ${(e as Error).message}`);
      }
    }

    return results;
  }

  private isNewProduct(text: string): boolean {
    return NEW_PRODUCT_KEYWORDS.some((kw) => text.includes(kw));
  }

  private extractBrand(text: string): string | null {
    return BRAND_KEYWORDS.find((b) => text.includes(b)) ?? null;
  }

  private extractProductName(title: string): string {
    return title
      .replace(/\[.*?\]/g, '')
      .replace(/신제품|출시|런칭/g, '')
      .trim()
      .split(/[,\-–|]/)[0]
      .trim();
  }
}
