import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    create(dto: CreateFavoriteDto, user: CurrentUserPayload): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        snackId: number;
    }>;
    delete(id: number, user: CurrentUserPayload): Promise<{
        message: string;
    }>;
    findAll(user: CurrentUserPayload, page?: string, limit?: string): Promise<{
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
