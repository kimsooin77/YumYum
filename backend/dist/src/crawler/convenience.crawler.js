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
var ConvenienceCrawler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvenienceCrawler = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const normalize_1 = require("./utils/normalize");
const SOURCES = [
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
let ConvenienceCrawler = ConvenienceCrawler_1 = class ConvenienceCrawler {
    logger = new common_1.Logger(ConvenienceCrawler_1.name);
    async crawl() {
        const results = [];
        for (const source of SOURCES) {
            try {
                const snacks = await this.crawlSource(source);
                results.push(...snacks);
                await this.delay(500);
            }
            catch (e) {
                this.logger.warn(`Convenience crawl failed: ${source.brand} — ${e.message}`);
            }
        }
        return results;
    }
    async crawlSource(source) {
        const html = await this.fetchWithTimeout(source.url);
        const $ = cheerio.load(html);
        const results = [];
        $(source.itemSelector).each((_, el) => {
            try {
                const name = $(el).find(source.nameSelector).text().trim();
                if (!name || name.length < 2)
                    return;
                const priceText = source.priceSelector ? $(el).find(source.priceSelector).text() : '';
                const price = this.parsePrice(priceText);
                const imageUrl = source.imageSelector
                    ? $(el).find(source.imageSelector).attr('src') ?? undefined
                    : undefined;
                const dateText = source.dateSelector ? $(el).find(source.dateSelector).text() : '';
                const releaseDate = (0, normalize_1.parseKoreanDate)(dateText) ?? new Date();
                if (Date.now() - releaseDate.getTime() > THREE_MONTHS_MS)
                    return;
                results.push({
                    name,
                    brand: source.brand,
                    category: (0, normalize_1.classifyCategory)(name),
                    price,
                    imageUrl,
                    releaseDate,
                });
            }
            catch {
            }
        });
        return results;
    }
    parsePrice(text) {
        const m = text.replace(/,/g, '').match(/\d+/);
        return m ? parseInt(m[0], 10) : undefined;
    }
    async fetchWithTimeout(url, timeoutMs = 10000) {
        const res = await axios_1.default.get(url, {
            timeout: timeoutMs,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YumYumBot/1.0)' },
        });
        return res.data;
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.ConvenienceCrawler = ConvenienceCrawler;
exports.ConvenienceCrawler = ConvenienceCrawler = ConvenienceCrawler_1 = __decorate([
    (0, common_1.Injectable)()
], ConvenienceCrawler);
//# sourceMappingURL=convenience.crawler.js.map