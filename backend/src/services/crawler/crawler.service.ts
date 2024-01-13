import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HHSTexasGovSource } from './sources/hhs-texas-gov.source';
import { performance } from 'perf_hooks';

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

    performance.mark('start search');
    await this.hhsTexas.crawlSearchResult();
    performance.mark('end search');

    performance.measure('search', 'start search', 'end search');

    performance.mark('start details');
    await this.hhsTexas.crawlDetailsPage();
    performance.mark('end details');

    performance.measure('details', 'start details', 'end details');

    const searchMeasures = performance.getEntriesByName('search');
    const detailsMeasures = performance.getEntriesByName('details');

    this.logger.debug('Search Measures: ', searchMeasures);
    this.logger.debug('Details Measures: ', detailsMeasures);

    performance.clearMarks();

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
}
