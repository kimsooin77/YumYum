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
