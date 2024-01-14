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

  private stopFlag: boolean;

  // Crawl apps.hhs.texas.gov
  async crawlAppsHhsTexasGov() {
    this.logger.debug('CrawlerService.crawlAppsHhsTexasGov()');

    await this.hhsTexas.crawlSearchResult();

    if (this.stopFlag) return;

    await this.hhsTexas.crawlDetailsPage();

    this.logger.debug('CrawlerService.crawlAppsHhsTexasGov() completed');
  }

  // Start crawling apps.hhs.texas.gov
  async startScheduledCrawlingJobs() {
    const job = this.schedulerRegistry.getCronJob('crawl-apps.hhs.texas.gov');
    job.start();
    return 'Start Scheduled Crawling Jobs';
  }

  // Stop crawling apps.hhs.texas.gov
  async stopScheduledCrawlingJobs() {
    const job = this.schedulerRegistry.getCronJob('crawl-apps.hhs.texas.gov');
    job.stop();
    return 'Stop Scheduled Crawling Jobs';
  }

  async startCrawling() {
    if (!this.hhsTexas.isCrawlerRunning()) await this.crawlAppsHhsTexasGov();
  }

  async stopCrawling() {
    if (this.hhsTexas.isCrawlerRunning()) {
      this.stopFlag = true;
      await this.hhsTexas.gracefulShutdown();
    }
  }
}
