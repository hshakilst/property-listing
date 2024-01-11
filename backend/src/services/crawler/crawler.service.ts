import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HHSTexasGovSource } from './sources/hhs-texas-gov.source';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly hhsTexas: HHSTexasGovSource,
  ) {}

  // Crawl apps.hhs.texas.gov
  async crawlAppsHhsTexasGov() {
    this.logger.debug('CrawlerService.crawlAppsHhsTexasGov()');
    await this.hhsTexas.crawlSearchResult();
    await this.hhsTexas.crawlDetailsPage();
    this.logger.debug('CrawlerService.crawlAppsHhsTexasGov() completed');
  }

  // Start crawling apps.hhs.texas.gov
  async startCrawlingAppsHhsTexasGov() {
    const job = this.schedulerRegistry.getCronJob('crawl-apps.hhs.texas.gov');
    job.start();
    return 'Start Crawling apps.hhs.texas.gov';
  }

  // Stop crawling apps.hhs.texas.gov
  async stopCrawlingAppsHhsTexasGov() {
    const job = this.schedulerRegistry.getCronJob('crawl-apps.hhs.texas.gov');
    job.stop();
    return 'Stop Crawling apps.hhs.texas.gov';
  }
}
