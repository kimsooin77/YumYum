import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(dto: CreateReviewDto, user: CurrentUserPayload): Promise<{
        user: {
            id: number;
            nickname: string;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateReviewDto, user: CurrentUserPayload): Promise<{
        user: {
            id: number;
            nickname: string;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    }>;
    delete(id: number, user: CurrentUserPayload): Promise<{
        message: string;
    }>;
    findAllBySnack(snackId: number, page?: string, limit?: string, sort?: 'newest' | 'highest' | 'lowest'): Promise<{
        data: ({
            user: {
                id: number;
                nickname: string;
            };
        } & {
            id: number;
            createdAt: Date;
            content: string;
            rating: number;
            userId: number;
            snackId: number;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            averageRating: number | null;
        };
    }>;
}
