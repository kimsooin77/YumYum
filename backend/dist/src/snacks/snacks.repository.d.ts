import { PrismaService } from '../prisma/prisma.service';
import { SnackQueryDto } from './dto/snack-query.dto';
export declare class SnacksRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: SnackQueryDto): Promise<{
        data: ({
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
            id: number;
            name: string;
            brandId: number;
            categoryId: number;
            description: string | null;
            imageUrl: string | null;
            price: number | null;
            releaseDate: Date | null;
            createdAt: Date;
        })[];
        total: number;
    }>;
    findById(id: number): Promise<({
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
        id: number;
        name: string;
        brandId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: number | null;
        releaseDate: Date | null;
        createdAt: Date;
    }) | null>;
    findNew(page: number, limit: number): Promise<{
        data: ({
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
            id: number;
            name: string;
            brandId: number;
            categoryId: number;
            description: string | null;
            imageUrl: string | null;
            price: number | null;
            releaseDate: Date | null;
            createdAt: Date;
        })[];
        total: number;
    }>;
    search(keyword: string, page: number, limit: number): Promise<{
        data: ({
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
            id: number;
            name: string;
            brandId: number;
            categoryId: number;
            description: string | null;
            imageUrl: string | null;
            price: number | null;
            releaseDate: Date | null;
            createdAt: Date;
        })[];
        total: number;
    }>;
    findByIds(ids: number[]): Promise<({
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
        id: number;
        name: string;
        brandId: number;
        categoryId: number;
        description: string | null;
        imageUrl: string | null;
        price: number | null;
        releaseDate: Date | null;
        createdAt: Date;
    })[]>;
}
