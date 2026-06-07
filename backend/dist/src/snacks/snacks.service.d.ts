import { SnacksRepository } from './snacks.repository';
import { SnackQueryDto, SearchQueryDto } from './dto/snack-query.dto';
export interface BlogPost {
    title: string;
    link: string;
    description: string;
    bloggerName: string;
    postDate: string;
}
export declare class SnacksService {
    private readonly snacksRepository;
    constructor(snacksRepository: SnacksRepository);
    findAll(query: SnackQueryDto, userId?: number | null): Promise<{
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
    findNew(page: number, limit: number): Promise<{
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
    getBlogReviews(snackId: number): Promise<BlogPost[]>;
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
}
