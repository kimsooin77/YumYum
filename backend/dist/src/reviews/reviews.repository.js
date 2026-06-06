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
exports.ReviewsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const reviewInclude = {
    user: { select: { id: true, nickname: true } },
};
let ReviewsRepository = class ReviewsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.review.create({ data, include: reviewInclude });
    }
    async update(id, data) {
        return this.prisma.review.update({ where: { id }, data, include: reviewInclude });
    }
    async delete(id) {
        return this.prisma.review.delete({ where: { id } });
    }
    async findById(id) {
        return this.prisma.review.findUnique({ where: { id } });
    }
    async findByUserAndSnack(userId, snackId) {
        return this.prisma.review.findUnique({
            where: { userId_snackId: { userId, snackId } },
        });
    }
    async findAllBySnackId(snackId, page, limit, sort) {
        const skip = (page - 1) * limit;
        const orderBy = sort === 'highest'
            ? { rating: 'desc' }
            : sort === 'lowest'
                ? { rating: 'asc' }
                : { createdAt: 'desc' };
        const [data, total, aggregate] = await Promise.all([
            this.prisma.review.findMany({
                where: { snackId },
                skip,
                take: limit,
                orderBy,
                include: reviewInclude,
            }),
            this.prisma.review.count({ where: { snackId } }),
            this.prisma.review.aggregate({ where: { snackId }, _avg: { rating: true } }),
        ]);
        return { data, total, averageRating: aggregate._avg.rating };
    }
    async findAllByUserId(userId) {
        return this.prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                snack: { select: { id: true, name: true, imageUrl: true } },
            },
        });
    }
};
exports.ReviewsRepository = ReviewsRepository;
exports.ReviewsRepository = ReviewsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsRepository);
//# sourceMappingURL=reviews.repository.js.map