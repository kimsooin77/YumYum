import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { classifyCategory, normalizeBrand, parseKoreanDate } from './utils/normalize';
import { RawSnack } from './rss.crawler';

const NEWS_SOURCES = [
  {
    url: 'https://www.thinkfood.co.kr/news/articleList.html?sc_section_code=S1N4&view_type=sm',
    titleSelector: '.titles',
    dateSelector: '.byline em',
    linkSelector: '.titles a',
    baseUrl: 'https://www.thinkfood.co.kr',
  },
];

const BRAND_KEYWORDS = ['농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '해태', 'GS25', 'CU', '세븐일레븐', '이마트24'];
const NEW_PRODUCT_KEYWORDS = ['신제품', '출시', '런칭', '신상'];
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

@Injectable()
export class NewsCrawler {
  private readonly logger = new Logger(NewsCrawler.name);

  async crawl(): Promise<RawSnack[]> {
    const results: RawSnack[] = [];

    for (const source of NEWS_SOURCES) {
      try {
        const html = await this.fetchWithTimeout(source.url);
        const $ = cheerio.load(html);

        const articleLinks: string[] = [];

        $(source.titleSelector).each((_, el) => {
          try {
            const title = $(el).text().trim();
            if (!this.isNewProduct(title)) return;

            const brand = this.extractBrand(title);
            if (!brand) return;

            const dateText = $(el).closest('li').find(source.dateSelector).text();
            const releaseDate = parseKoreanDate(dateText) ?? undefined;

            if (releaseDate && Date.now() - releaseDate.getTime() > THREE_MONTHS_MS) return;

            const href = $(el).find('a').attr('href') ?? $(el).closest('li').find(source.linkSelector).attr('href');
            const articleUrl = href
              ? href.startsWith('http') ? href : `${source.baseUrl}${href}`
              : null;

            if (articleUrl) articleLinks.push(articleUrl);

            const snack: RawSnack = {
              name: this.extractProductName(title),
              brand: normalizeBrand(brand),
              category: classifyCategory(title),
              releaseDate,
            };

            if (snack.name.length > 2) results.push(snack);
          } catch {
            // skip individual item errors
          }
        });

        // Fetch og:image from articles (up to 5, parallel)
        const imageResults = await Promise.allSettled(
          articleLinks.slice(0, 5).map((url) => this.fetchOgImage(url))
        );
        imageResults.forEach((res, i) => {
          if (res.status === 'fulfilled' && res.value && results[i]) {
            results[i].imageUrl = res.value;
          }
        });
      } catch (e) {
        this.logger.warn(`News crawl failed: ${source.url} — ${(e as Error).message}`);
      }
    }

    return results;
  }

  private async fetchOgImage(url: string): Promise<string | null> {
    try {
      const html = await this.fetchWithTimeout(url, 5000);
      const $ = cheerio.load(html);
      return $('meta[property="og:image"]').attr('content') ?? null;
    } catch {
      return null;
    }
  }

  private async fetchWithTimeout(url: string, timeoutMs = 10000): Promise<string> {
    const res = await axios.get(url, {
      timeout: timeoutMs,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YumYumBot/1.0)' },
    });
    return res.data as string;
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
      .replace(/신제품|출시|런칭|,\s*\d+원/g, '')
      .trim()
      .split(/[,\-–|]/)[0]
      .trim();
  }
}
