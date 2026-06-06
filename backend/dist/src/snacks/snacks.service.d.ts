import { SnacksRepository } from './snacks.repository';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';
export declare class SnacksService {
    private readonly snacksRepository;
    constructor(snacksRepository: SnacksRepository);
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
    findNew(page: number, limit: number): Promise<{
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
}
