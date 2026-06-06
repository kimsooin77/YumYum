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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const favorites_repository_1 = require("../favorites/favorites.repository");
let RecommendationsService = class RecommendationsService {
    prisma;
    favoritesRepository;
    constructor(prisma, favoritesRepository) {
        this.prisma = prisma;
        this.favoritesRepository = favoritesRepository;
    }
    async recommend(userId, limit = 10) {
        const favoriteSnackIds = await this.favoritesRepository.findUserFavoriteSnackIds(userId);
        let categoryIds = [];
        let brandIds = [];
        if (favoriteSnackIds.length > 0) {
            const favoriteSnacks = await this.prisma.snack.findMany({
                where: { id: { in: favoriteSnackIds } },
                select: { categoryId: true, brandId: true },
            });
            categoryIds = [...new Set(favoriteSnacks.map((s) => s.categoryId))];
            brandIds = [...new Set(favoriteSnacks.map((s) => s.brandId))];
        }
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const categoryBased = categoryIds.length > 0
            ? await this.prisma.snack.findMany({
                where: {
                    categoryId: { in: categoryIds },
                    id: { notIn: favoriteSnackIds },
                    releaseDate: { gte: thirtyDaysAgo },
                },
                take: Math.ceil(limit / 2),
                orderBy: { releaseDate: 'desc' },
                include: {
                    brand: { select: { id: true, name: true } },
                    category: { select: { id: true, name: true } },
                    reviews: { select: { rating: true } },
                },
            })
            : [];
        const existing = new Set([...favoriteSnackIds, ...categoryBased.map((s) => s.id)]);
        const highRated = await this.prisma.snack.findMany({
            where: {
                id: { notIn: Array.from(existing) },
                releaseDate: { gte: thirtyDaysAgo },
            },
            take: limit - categoryBased.length,
            orderBy: { createdAt: 'desc' },
            include: {
                brand: { select: { id: true, name: true } },
                category: { select: { id: true, name: true } },
                reviews: { select: { rating: true } },
            },
        });
        const all = [...categoryBased, ...highRated].slice(0, limit);
        return {
            recommendations: all.map((snack) => {
                const ratings = snack.reviews.map((r) => r.rating);
                const averageRating = ratings.length > 0
                    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                    : null;
                const isCategoryBased = categoryBased.some((s) => s.id === snack.id);
                return {
                    id: snack.id,
                    name: snack.name,
                    brand: snack.brand,
                    category: snack.category,
                    imageUrl: snack.imageUrl,
                    price: snack.price,
                    releaseDate: snack.releaseDate,
                    averageRating,
                    reviewCount: ratings.length,
                    reason: isCategoryBased ? '관심 카테고리 기반 추천' : '신상품 추천',
                };
            }),
            generatedAt: new Date(),
        };
    }
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        favorites_repository_1.FavoritesRepository])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map