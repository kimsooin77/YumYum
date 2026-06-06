import { FavoritesRepository } from './favorites.repository';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesService {
    private readonly favoritesRepository;
    constructor(favoritesRepository: FavoritesRepository);
    create(userId: number, dto: CreateFavoriteDto): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    }>;
    delete(id: number, userId: number): Promise<{
        message: string;
    }>;
    findAll(userId: number, page: number, limit: number): Promise<{
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
            } & {
                id: number;
                name: string;
                brandId: number;
                categoryId: number;
                description: string | null;
                imageUrl: string | null;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
