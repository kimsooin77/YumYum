"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CrawlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const common_1 = require("@nestjs/common");
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_service_1 = require("../prisma/prisma.service");
const rss_crawler_1 = require("./rss.crawler");
const news_crawler_1 = require("./news.crawler");
const convenience_crawler_1 = require("./convenience.crawler");
const normalize_1 = require("./utils/normalize");
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;
let CrawlerService = CrawlerService_1 = class CrawlerService {
    prisma;
    rssCrawler;
    newsCrawler;
    convenienceCrawler;
    logger = new common_1.Logger(CrawlerService_1.name);
    constructor(prisma, rssCrawler, newsCrawler, convenienceCrawler) {
        this.prisma = prisma;
        this.rssCrawler = rssCrawler;
        this.newsCrawler = newsCrawler;
        this.convenienceCrawler = convenienceCrawler;
        node_cron_1.default.schedule('0 9 * * *', () => {
            void this.runCollection();
        });
        this.logger.log('Crawler scheduled: 0 9 * * *');
    }
    async runCollection() {
        this.logger.log('크롤링 시작...');
        const rawResults = await Promise.allSettled([
            this.rssCrawler.crawl(),
            this.newsCrawler.crawl(),
            this.convenienceCrawler.crawl(),
        ]);
        const allSnacks = [];
        for (const result of rawResults) {
            if (result.status === 'fulfilled') {
                allSnacks.push(...result.value);
            }
            else {
                this.logger.warn(`크롤러 오류: ${result.reason.message}`);
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
            }
            catch (e) {
                this.logger.warn(`저장 실패: ${snack.name} — ${e.message}`);
            }
        }
        this.logger.log(`크롤링 완료: ${saved}개 저장`);
    }
    deduplicate(snacks) {
        const seen = [];
        return snacks.filter((s) => {
            const key = (0, normalize_1.normalize)(s.name);
            if (seen.some((k) => (0, normalize_1.isSimilar)(k, key)))
                return false;
            seen.push(key);
            return true;
        });
    }
    async saveSnack(raw) {
        if (!raw.name || raw.name.length < 2)
            return;
        const releaseDate = raw.releaseDate ?? new Date();
        if (Date.now() - releaseDate.getTime() > THREE_MONTHS_MS)
            return;
        const brandName = (0, normalize_1.normalizeBrand)(raw.brand);
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
};
exports.CrawlerService = CrawlerService;
exports.CrawlerService = CrawlerService = CrawlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rss_crawler_1.RssCrawler,
        news_crawler_1.NewsCrawler,
        convenience_crawler_1.ConvenienceCrawler])
], CrawlerService);
//# sourceMappingURL=crawler.service.js.map