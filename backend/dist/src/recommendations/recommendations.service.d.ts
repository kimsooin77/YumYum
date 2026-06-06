import { PrismaService } from '../prisma/prisma.service';
import { FavoritesRepository } from '../favorites/favorites.repository';
export declare class RecommendationsService {
    private readonly prisma;
    private readonly favoritesRepository;
    constructor(prisma: PrismaService, favoritesRepository: FavoritesRepository);
    recommend(userId: number, limit?: number): Promise<{
        recommendations: {
            id: number;
            name: string;
            brand: {
                id: number;
                name: string;
            };
            category: {
                id: number;
                name: string;
            };
            imageUrl: string | null;
            price: number | null;
            releaseDate: Date | null;
            averageRating: number | null;
            reviewCount: number;
            reason: string;
        }[];
        generatedAt: Date;
    }>;
}
