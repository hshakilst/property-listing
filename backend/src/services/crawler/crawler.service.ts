import { PropertyModel } from './../../common/models/property.model';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HHSTexasGovSource } from './sources/hhs-texas-gov.source';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly hhsTexas: HHSTexasGovSource,
    @InjectModel(PropertyModel.name)
    private readonly propertyModel: Model<PropertyModel>,
  ) {}

  // Crawl apps.hhs.texas.gov
  async crawlAppsHhsTexasGov() {
    this.logger.debug('CrawlerService.crawlAppsHhsTexasGov()');
    const properties = await this.hhsTexas.crawl();
    this.logger.debug(`properties.length: ${properties.length}`);
    const writeResult = await this.propertyModel.bulkWrite(
      properties.map((property) => ({
        updateOne: {
          filter: { externalId: property.externalId, source: property.source },
          update: property,
          upsert: true,
        },
      })),
    );
    this.logger.debug(writeResult);
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
