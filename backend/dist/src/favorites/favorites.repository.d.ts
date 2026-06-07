import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: number, snackId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    }>;
    delete(id: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    }>;
    findById(id: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    } | null>;
    findByUserAndSnack(userId: number, snackId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    } | null>;
    findAllByUserId(userId: number, page: number, limit: number): Promise<{
        data: ({
            snack: {
                category: {
                    id: number;
                    name: string;
                };
                brand: {
                    id: number;
                    name: string;
                };
                reviews: {
                    rating: number;
                }[];
                _count: {
                    favorites: number;
                    reviews: number;
                };
            } & {
                imageUrl: string | null;
                id: number;
                name: string;
                brandId: number;
                categoryId: number;
                description: string | null;
                price: number | null;
                releaseDate: Date | null;
                createdAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            snackId: number;
        })[];
        total: number;
    }>;
    findUserFavoriteSnackIds(userId: number): Promise<number[]>;
}
