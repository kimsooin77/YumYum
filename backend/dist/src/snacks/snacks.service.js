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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnacksService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const snacks_repository_1 = require("./snacks.repository");
function formatSnack(snack) {
    const ratings = snack.reviews?.map((r) => r.rating) ?? [];
    const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;
    const favoriteId = snack.favorites?.[0]?.id ?? null;
    return {
        id: snack.id,
        name: snack.name,
        brand: snack.brand,
        category: snack.category,
        description: snack.description,
        imageUrl: snack.imageUrl,
        price: snack.price,
        releaseDate: snack.releaseDate,
        createdAt: snack.createdAt,
        avgRating: averageRating ?? 0,
        reviewCount: snack._count?.reviews ?? 0,
        favoriteCount: snack._count?.favorites ?? 0,
        isFavorited: favoriteId != null,
        ...(favoriteId != null && { favoriteId }),
    };
}
let SnacksService = class SnacksService {
    snacksRepository;
    constructor(snacksRepository) {
        this.snacksRepository = snacksRepository;
    }
    async findAll(query, userId) {
        const { data, total } = await this.snacksRepository.findAll(query, userId);
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: data.map((s) => formatSnack(s)),
            total,
            page: query.page,
            limit: query.limit,
            totalPages,
        };
    }
    async findById(id) {
        const snack = await this.snacksRepository.findById(id);
        if (!snack)
            throw new common_1.NotFoundException('과자를 찾을 수 없습니다.');
        return formatSnack(snack);
    }
    async findNew(page, limit) {
        const { data, total } = await this.snacksRepository.findNew(page, limit);
        const totalPages = Math.ceil(total / limit);
        return {
            data: data.map((s) => formatSnack(s)),
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getBlogReviews(snackId) {
        const snack = await this.snacksRepository.findById(snackId);
        if (!snack)
            throw new common_1.NotFoundException('과자를 찾을 수 없습니다.');
        try {
            const query = encodeURIComponent(snack.name);
            const url = `https://search.naver.com/search.naver?where=blog&query=${query}`;
            const { data: html } = await axios_1.default.get(url, {
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept-Language': 'ko-KR,ko;q=0.9',
                },
            });
            const $ = cheerio.load(html);
            const posts = [];
            $('.total_wrap').each((_, el) => {
                const titleEl = $(el).find('.title_link').first();
                const title = titleEl.text().trim();
                const link = titleEl.attr('href') ?? '';
                if (!title || !link)
                    return;
                const description = $(el).find('.dsc_txt, .api_txt_lines').first().text().trim();
                const bloggerName = $(el).find('.user_info .name, .sub_txt .name').first().text().trim();
                const postDate = $(el).find('.sub_txt .sub_time, .sub_txt .date').first().text().trim();
                posts.push({ title, link, description, bloggerName, postDate });
            });
            return posts.slice(0, 5);
        }
        catch {
            return [];
        }
    }
    async search(query) {
        if (!query.q || query.q.trim().length < 2) {
            throw new common_1.BadRequestException('검색어는 2자 이상이어야 합니다.');
        }
        const { data, total } = await this.snacksRepository.search(query.q.trim(), query.page, query.limit);
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: data.map((s) => formatSnack(s)),
            total,
            page: query.page,
            limit: query.limit,
            totalPages,
        };
    }
};
exports.SnacksService = SnacksService;
exports.SnacksService = SnacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [snacks_repository_1.SnacksRepository])
], SnacksService);
//# sourceMappingURL=snacks.service.js.map