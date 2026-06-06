import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: number;
        snackId: number;
        rating: number;
        content: string;
    }): Promise<{
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
    update(id: number, data: {
        rating?: number;
        content?: string;
    }): Promise<{
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
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    }>;
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    } | null>;
    findByUserAndSnack(userId: number, snackId: number): Promise<{
        id: number;
        createdAt: Date;
        content: string;
        rating: number;
        userId: number;
        snackId: number;
        updatedAt: Date;
    } | null>;
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
        total: number;
        averageRating: number | null;
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
