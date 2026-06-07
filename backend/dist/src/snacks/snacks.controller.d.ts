import { SnacksService } from './snacks.service';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';
export declare class SnacksController {
    private readonly snacksService;
    constructor(snacksService: SnacksService);
    findAll(query: SnackQueryDto, req: any): Promise<{
        data: {
            favoriteId?: any;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            avgRating: number;
            reviewCount: any;
            favoriteCount: any;
            isFavorited: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findNew(page?: string, limit?: string): Promise<{
        data: {
            favoriteId?: any;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            avgRating: number;
            reviewCount: any;
            favoriteCount: any;
            isFavorited: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(query: SearchQueryDto): Promise<{
        data: {
            favoriteId?: any;
            id: any;
            name: any;
            brand: any;
            category: any;
            description: any;
            imageUrl: any;
            price: any;
            releaseDate: any;
            createdAt: any;
            avgRating: number;
            reviewCount: any;
            favoriteCount: any;
            isFavorited: boolean;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBlogReviews(id: number): Promise<import("./snacks.service").BlogPost[]>;
    findById(id: number): Promise<{
        favoriteId?: any;
        id: any;
        name: any;
        brand: any;
        category: any;
        description: any;
        imageUrl: any;
        price: any;
        releaseDate: any;
        createdAt: any;
        avgRating: number;
        reviewCount: any;
        favoriteCount: any;
        isFavorited: boolean;
    }>;
}
