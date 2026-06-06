"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RssCrawler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssCrawler = void 0;
const common_1 = require("@nestjs/common");
const rss_parser_1 = __importDefault(require("rss-parser"));
const normalize_1 = require("./utils/normalize");
const RSS_FEEDS = [
    {
        url: 'https://www.thinkfood.co.kr/rss/allArticle.xml',
        brand: null,
    },
];
const BRAND_KEYWORDS = ['농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '해태', 'GS25', 'CU', '세븐일레븐', '이마트24'];
const NEW_PRODUCT_KEYWORDS = ['신제품', '출시', '런칭', '신상', '새롭게', '새로운'];
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;
let RssCrawler = RssCrawler_1 = class RssCrawler {
    logger = new common_1.Logger(RssCrawler_1.name);
    parser = new rss_parser_1.default({ timeout: 10000 });
    async crawl() {
        const results = [];
        for (const feed of RSS_FEEDS) {
            try {
                const parsed = await this.parser.parseURL(feed.url);
                for (const item of parsed.items ?? []) {
                    if (!this.isNewProduct(item.title ?? ''))
                        continue;
                    const releaseDate = item.pubDate ? new Date(item.pubDate) : undefined;
                    if (releaseDate && Date.now() - releaseDate.getTime() > THREE_MONTHS_MS)
                        continue;
                    const brand = feed.brand ?? this.extractBrand(item.title + ' ' + (item.contentSnippet ?? ''));
                    if (!brand)
                        continue;
                    const snack = {
                        name: this.extractProductName(item.title ?? ''),
                        brand: (0, normalize_1.normalizeBrand)(brand),
                        category: (0, normalize_1.classifyCategory)(item.title ?? ''),
                        description: item.contentSnippet?.slice(0, 300),
                        releaseDate,
                    };
                    if (snack.name)
                        results.push(snack);
                }
            }
            catch (e) {
                this.logger.warn(`RSS feed failed: ${feed.url} — ${e.message}`);
            }
        }
        return results;
    }
    isNewProduct(text) {
        return NEW_PRODUCT_KEYWORDS.some((kw) => text.includes(kw));
    }
    extractBrand(text) {
        return BRAND_KEYWORDS.find((b) => text.includes(b)) ?? null;
    }
    extractProductName(title) {
        return title
            .replace(/\[.*?\]/g, '')
            .replace(/신제품|출시|런칭/g, '')
            .trim()
            .split(/[,\-–|]/)[0]
            .trim();
    }
};
exports.RssCrawler = RssCrawler;
exports.RssCrawler = RssCrawler = RssCrawler_1 = __decorate([
    (0, common_1.Injectable)()
], RssCrawler);
//# sourceMappingURL=rss.crawler.js.map