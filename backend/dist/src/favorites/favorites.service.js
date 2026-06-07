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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const favorites_repository_1 = require("./favorites.repository");
let FavoritesService = class FavoritesService {
    favoritesRepository;
    constructor(favoritesRepository) {
        this.favoritesRepository = favoritesRepository;
    }
    async create(userId, dto) {
        const existing = await this.favoritesRepository.findByUserAndSnack(userId, dto.snackId);
        if (existing)
            throw new common_1.ConflictException('이미 좋아요한 과자입니다.');
        return this.favoritesRepository.create(userId, dto.snackId);
    }
    async delete(id, userId) {
        const favorite = await this.favoritesRepository.findById(id);
        if (!favorite)
            throw new common_1.NotFoundException('좋아요 항목을 찾을 수 없습니다.');
        if (favorite.userId !== userId)
            throw new common_1.ForbiddenException('권한이 없습니다.');
        await this.favoritesRepository.delete(id);
        return { message: '관심상품이 해제되었습니다.' };
    }
    async findAll(userId, page, limit) {
        const { data, total } = await this.favoritesRepository.findAllByUserId(userId, page, limit);
        const totalPages = Math.ceil(total / limit);
        const formatted = data.map((fav) => {
            const snack = fav.snack;
            const ratings = snack.reviews?.map((r) => r.rating) ?? [];
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 10) / 10
                : 0;
            return {
                id: fav.id,
                snackId: fav.snackId,
                createdAt: fav.createdAt,
                snack: {
                    id: snack.id,
                    name: snack.name,
                    description: snack.description,
                    imageUrl: snack.imageUrl,
                    price: snack.price,
                    releaseDate: snack.releaseDate,
                    createdAt: snack.createdAt,
                    brand: snack.brand,
                    category: snack.category,
                    avgRating,
                    reviewCount: snack._count?.reviews ?? 0,
                    favoriteCount: snack._count?.favorites ?? 0,
                    isFavorited: true,
                    favoriteId: fav.id,
                },
            };
        });
        return { data: formatted, total, page, limit, totalPages };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [favorites_repository_1.FavoritesRepository])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map