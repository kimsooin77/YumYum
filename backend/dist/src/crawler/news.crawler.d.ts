import { RawSnack } from './rss.crawler';
export declare class NewsCrawler {
    private readonly logger;
    crawl(): Promise<RawSnack[]>;
    private fetchOgImage;
    private fetchWithTimeout;
    private isNewProduct;
    private extractBrand;
    private extractProductName;
}
