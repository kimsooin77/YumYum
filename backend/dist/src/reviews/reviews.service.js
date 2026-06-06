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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const reviews_repository_1 = require("./reviews.repository");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    constructor(reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }
    async create(userId, dto) {
        const existing = await this.reviewsRepository.findByUserAndSnack(userId, dto.snackId);
        if (existing)
            throw new common_1.ConflictException('이미 해당 과자에 리뷰를 작성했습니다.');
        return this.reviewsRepository.create({ userId, ...dto });
    }
    async update(id, userId, dto) {
        const review = await this.reviewsRepository.findById(id);
        if (!review)
            throw new common_1.NotFoundException('리뷰를 찾을 수 없습니다.');
        if (review.userId !== userId)
            throw new common_1.ForbiddenException('권한이 없습니다.');
        return this.reviewsRepository.update(id, dto);
    }
    async delete(id, userId) {
        const review = await this.reviewsRepository.findById(id);
        if (!review)
            throw new common_1.NotFoundException('리뷰를 찾을 수 없습니다.');
        if (review.userId !== userId)
            throw new common_1.ForbiddenException('권한이 없습니다.');
        await this.reviewsRepository.delete(id);
        return { message: '리뷰가 삭제되었습니다.' };
    }
    async findAllBySnackId(snackId, page, limit, sort) {
        const { data, total, averageRating } = await this.reviewsRepository.findAllBySnackId(snackId, page, limit, sort);
        const totalPages = Math.ceil(total / limit);
        return { data, meta: { total, page, limit, totalPages, averageRating } };
    }
    async findAllByUserId(userId) {
        return this.reviewsRepository.findAllByUserId(userId);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reviews_repository_1.ReviewsRepository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map