import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(userId: number, dto: CreateReviewDto) {
    const existing = await this.reviewsRepository.findByUserAndSnack(userId, dto.snackId);
    if (existing) throw new ConflictException('이미 해당 과자에 리뷰를 작성했습니다.');
    return this.reviewsRepository.create({ userId, ...dto });
  }

  async update(id: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    if (review.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
    return this.reviewsRepository.update(id, dto);
  }

  async delete(id: number, userId: number) {
    const review = await this.reviewsRepository.findById(id);
    if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    if (review.userId !== userId) throw new ForbiddenException('권한이 없습니다.');
    await this.reviewsRepository.delete(id);
    return { message: '리뷰가 삭제되었습니다.' };
  }

  async findAllBySnackId(
    snackId: number,
    page: number,
    limit: number,
    sort: 'newest' | 'highest' | 'lowest',
  ) {
    const { data, total, averageRating } = await this.reviewsRepository.findAllBySnackId(
      snackId,
      page,
      limit,
      sort,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, meta: { total, page, limit, totalPages, averageRating } };
  }

  async findAllByUserId(userId: number) {
    return this.reviewsRepository.findAllByUserId(userId);
  }
}
