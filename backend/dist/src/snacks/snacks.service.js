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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnacksService = void 0;
const common_1 = require("@nestjs/common");
const snacks_repository_1 = require("./snacks.repository");
function formatSnack(snack, favoriteId) {
    const ratings = snack.reviews?.map((r) => r.rating) ?? [];
    const averageRating = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;
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
        averageRating,
        reviewCount: snack._count?.reviews ?? 0,
        isFavorited: favoriteId != null,
        ...(favoriteId != null && { favoriteId }),
    };
}
let SnacksService = class SnacksService {
    snacksRepository;
    constructor(snacksRepository) {
        this.snacksRepository = snacksRepository;
    }
    async findAll(query) {
        const { data, total } = await this.snacksRepository.findAll(query);
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: data.map((s) => formatSnack(s)),
            meta: { total, page: query.page, limit: query.limit, totalPages },
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
            meta: { total, page, limit, totalPages },
        };
    }
    async search(query) {
        if (!query.q || query.q.trim().length < 2) {
            throw new common_1.BadRequestException('검색어는 2자 이상이어야 합니다.');
        }
        const { data, total } = await this.snacksRepository.search(query.q.trim(), query.page, query.limit);
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: data.map((s) => formatSnack(s)),
            meta: { total, page: query.page, limit: query.limit, totalPages },
        };
    }
};
exports.SnacksService = SnacksService;
exports.SnacksService = SnacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [snacks_repository_1.SnacksRepository])
], SnacksService);
//# sourceMappingURL=snacks.service.js.map