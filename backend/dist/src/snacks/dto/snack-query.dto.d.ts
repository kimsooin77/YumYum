export declare class SnackQueryDto {
    page: number;
    limit: number;
    categoryId?: number;
    brandId?: number;
    sort: 'newest' | 'rating' | 'popular';
    dateRange?: 'today' | 'week' | 'month';
}
export declare class SearchQueryDto {
    q?: string;
    page: number;
    limit: number;
}
