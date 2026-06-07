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
exports.SnacksRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const snackInclude = {
    brand: { select: { id: true, name: true } },
    category: { select: { id: true, name: true } },
    _count: { select: { reviews: true, favorites: true } },
    reviews: { select: { rating: true } },
};
let SnacksRepository = class SnacksRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query, userId) {
        const { page, limit, categoryId, brandId, sort, dateRange } = query;
        const skip = (page - 1) * limit;
        let releaseDateFilter;
        if (dateRange) {
            const from = new Date();
            if (dateRange === 'today') {
                from.setHours(0, 0, 0, 0);
            }
            else if (dateRange === 'week') {
                from.setDate(from.getDate() - 7);
            }
            else if (dateRange === 'month') {
                from.setDate(from.getDate() - 30);
            }
            releaseDateFilter = { gte: from };
        }
        const where = {
            ...(categoryId && { categoryId }),
            ...(brandId && { brandId }),
            ...(releaseDateFilter && { releaseDate: releaseDateFilter }),
        };
        const orderBy = sort === 'rating'
            ? { reviews: { _count: 'desc' } }
            : sort === 'popular'
                ? { favorites: { _count: 'desc' } }
                : { releaseDate: 'desc' };
        const include = {
            ...snackInclude,
            ...(userId && {
                favorites: { where: { userId }, select: { id: true } },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.snack.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include,
            }),
            this.prisma.snack.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        return this.prisma.snack.findUnique({
            where: { id },
            include: snackInclude,
        });
    }
    async findNew(page, limit) {
        const skip = (page - 1) * limit;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const where = { releaseDate: { gte: thirtyDaysAgo } };
        const [data, total] = await Promise.all([
            this.prisma.snack.findMany({
                where,
                skip,
                take: limit,
                orderBy: { releaseDate: 'desc' },
                include: snackInclude,
            }),
            this.prisma.snack.count({ where }),
        ]);
        return { data, total };
    }
    async search(keyword, page, limit) {
        const skip = (page - 1) * limit;
        const where = { name: { contains: keyword, mode: 'insensitive' } };
        const [data, total] = await Promise.all([
            this.prisma.snack.findMany({
                where,
                skip,
                take: limit,
                orderBy: { releaseDate: 'desc' },
                include: snackInclude,
            }),
            this.prisma.snack.count({ where }),
        ]);
        return { data, total };
    }
    async findByIds(ids) {
        return this.prisma.snack.findMany({
            where: { id: { in: ids } },
            include: snackInclude,
        });
    }
};
exports.SnacksRepository = SnacksRepository;
exports.SnacksRepository = SnacksRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SnacksRepository);
//# sourceMappingURL=snacks.repository.js.map