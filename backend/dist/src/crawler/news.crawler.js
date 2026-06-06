"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NewsCrawler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCrawler = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const normalize_1 = require("./utils/normalize");
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
let NewsCrawler = NewsCrawler_1 = class NewsCrawler {
    logger = new common_1.Logger(NewsCrawler_1.name);
    async crawl() {
        const results = [];
        for (const source of NEWS_SOURCES) {
            try {
                const html = await this.fetchWithTimeout(source.url);
                const $ = cheerio.load(html);
                $(source.titleSelector).each((_, el) => {
                    try {
                        const title = $(el).text().trim();
                        if (!this.isNewProduct(title))
                            return;
                        const brand = this.extractBrand(title);
                        if (!brand)
                            return;
                        const dateText = $(el).closest('li').find(source.dateSelector).text();
                        const releaseDate = (0, normalize_1.parseKoreanDate)(dateText) ?? undefined;
                        if (releaseDate && Date.now() - releaseDate.getTime() > THREE_MONTHS_MS)
                            return;
                        const snack = {
                            name: this.extractProductName(title),
                            brand: (0, normalize_1.normalizeBrand)(brand),
                            category: (0, normalize_1.classifyCategory)(title),
                            releaseDate,
                        };
                        if (snack.name.length > 2)
                            results.push(snack);
                    }
                    catch {
                    }
                });
            }
            catch (e) {
                this.logger.warn(`News crawl failed: ${source.url} — ${e.message}`);
            }
        }
        return results;
    }
    async fetchWithTimeout(url, timeoutMs = 10000) {
        const res = await axios_1.default.get(url, {
            timeout: timeoutMs,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YumYumBot/1.0)' },
        });
        return res.data;
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
            .replace(/신제품|출시|런칭|,\s*\d+원/g, '')
            .trim()
            .split(/[,\-–|]/)[0]
            .trim();
    }
};
exports.NewsCrawler = NewsCrawler;
exports.NewsCrawler = NewsCrawler = NewsCrawler_1 = __decorate([
    (0, common_1.Injectable)()
], NewsCrawler);
//# sourceMappingURL=news.crawler.js.map