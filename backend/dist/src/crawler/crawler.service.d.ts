import { PrismaService } from '../prisma/prisma.service';
import { RssCrawler } from './rss.crawler';
import { NewsCrawler } from './news.crawler';
import { ConvenienceCrawler } from './convenience.crawler';
export declare class CrawlerService {
    private readonly prisma;
    private readonly rssCrawler;
    private readonly newsCrawler;
    private readonly convenienceCrawler;
    private readonly logger;
    constructor(prisma: PrismaService, rssCrawler: RssCrawler, newsCrawler: NewsCrawler, convenienceCrawler: ConvenienceCrawler);
    runCollection(): Promise<void>;
    private deduplicate;
    private saveSnack;
}
