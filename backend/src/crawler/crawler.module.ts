import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { RssCrawler } from './rss.crawler';
import { NewsCrawler } from './news.crawler';
import { ConvenienceCrawler } from './convenience.crawler';

@Module({
  providers: [CrawlerService, RssCrawler, NewsCrawler, ConvenienceCrawler],
  exports: [CrawlerService],
})
export class CrawlerModule {}
