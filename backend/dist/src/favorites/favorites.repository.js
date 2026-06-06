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
exports.FavoritesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesRepository = class FavoritesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, snackId) {
        return this.prisma.favorite.create({
            data: { userId, snackId },
        });
    }
    async delete(id) {
        return this.prisma.favorite.delete({ where: { id } });
    }
    async findById(id) {
        return this.prisma.favorite.findUnique({ where: { id } });
    }
    async findByUserAndSnack(userId, snackId) {
        return this.prisma.favorite.findUnique({
            where: { userId_snackId: { userId, snackId } },
        });
    }
    async findAllByUserId(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.favorite.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    snack: {
                        include: {
                            brand: { select: { id: true, name: true } },
                            category: { select: { id: true, name: true } },
                        },
                    },
                },
            }),
            this.prisma.favorite.count({ where: { userId } }),
        ]);
        return { data, total };
    }
    async findUserFavoriteSnackIds(userId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            select: { snackId: true },
        });
        return favorites.map((f) => f.snackId);
    }
};
exports.FavoritesRepository = FavoritesRepository;
exports.FavoritesRepository = FavoritesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesRepository);
//# sourceMappingURL=favorites.repository.js.map