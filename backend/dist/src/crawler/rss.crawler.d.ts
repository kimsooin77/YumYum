export interface RawSnack {
    name: string;
    brand: string;
    category: string;
    description?: string;
    releaseDate?: Date;
    imageUrl?: string;
    price?: number;
}
export declare class RssCrawler {
    private readonly logger;
    private readonly parser;
    crawl(): Promise<RawSnack[]>;
    private isNewProduct;
    private extractBrand;
    private extractProductName;
}
