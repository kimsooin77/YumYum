import { SnacksService } from './snacks.service';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';
export declare class SnacksController {
    private readonly snacksService;
    constructor(snacksService: SnacksService);
    findAll(query: SnackQueryDto): Promise<{
        data: {
            favoriteId?: number | undefined;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            averageRating: number | null;
            reviewCount: any;
            isFavorited: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findNew(page?: string, limit?: string): Promise<{
        data: {
            favoriteId?: number | undefined;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            averageRating: number | null;
            reviewCount: any;
            isFavorited: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    search(query: SearchQueryDto): Promise<{
        data: {
            favoriteId?: number | undefined;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            averageRating: number | null;
            reviewCount: any;
            isFavorited: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findById(id: number): Promise<{
        favoriteId?: number | undefined;
        id: any;
        name: any;
        brand: any;
        category: any;
        description: any;
        imageUrl: any;
        price: any;
        releaseDate: any;
        createdAt: any;
        averageRating: number | null;
        reviewCount: any;
        isFavorited: boolean;
    }>;
}
