import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly reviewsRepository;
    constructor(reviewsRepository: ReviewsRepository);
    create(userId: number, dto: CreateReviewDto): Promise<{
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
    update(id: number, userId: number, dto: UpdateReviewDto): Promise<{
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
    delete(id: number, userId: number): Promise<{
        message: string;
    }>;
    findAllBySnackId(snackId: number, page: number, limit: number, sort: 'newest' | 'highest' | 'lowest'): Promise<{
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
    findAllByUserId(userId: number): Promise<({
        snack: {
            id: number;
            name: string;
            imageUrl: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    })[]>;
}
