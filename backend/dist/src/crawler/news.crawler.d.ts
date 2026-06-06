import { RawSnack } from './rss.crawler';
export declare class NewsCrawler {
    private readonly logger;
    crawl(): Promise<RawSnack[]>;
    private fetchWithTimeout;
    private isNewProduct;
    private extractBrand;
    private extractProductName;
}
