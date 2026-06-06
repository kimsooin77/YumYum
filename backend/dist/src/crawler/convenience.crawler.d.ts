import { RawSnack } from './rss.crawler';
export declare class ConvenienceCrawler {
    private readonly logger;
    crawl(): Promise<RawSnack[]>;
    private crawlSource;
    private parsePrice;
    private fetchWithTimeout;
    private delay;
}
