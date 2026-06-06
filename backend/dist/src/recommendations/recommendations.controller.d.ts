import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { RecommendationsService } from './recommendations.service';
export declare class RecommendationsController {
    private readonly recommendationsService;
    constructor(recommendationsService: RecommendationsService);
    recommend(user: CurrentUserPayload, limit?: string): Promise<{
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
