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
        data: {
            id: any;
            snackId: any;
            createdAt: any;
            snack: {
                id: any;
                name: any;
                description: any;
                imageUrl: any;
                price: any;
                releaseDate: any;
                createdAt: any;
                brand: any;
                category: any;
                avgRating: number;
                reviewCount: any;
                favoriteCount: any;
                isFavorited: boolean;
                favoriteId: any;
            };
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
