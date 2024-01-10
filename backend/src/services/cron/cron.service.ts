import { CrawlerService } from './../crawler/crawler.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly crawler: CrawlerService) {}

  //   @Cron(CronExpression.EVERY_DAY_AT_5AM, {
  //     name: 'crawl-apps.hhs.texas.gov',
  //   })
  @Timeout(5000)
  handleCrawlAppsHhsTexasGov() {
    try {
      this.logger.debug('CronService.handleCrawlAppsHhsTexasGov()');
      this.crawler.crawlAppsHhsTexasGov();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
