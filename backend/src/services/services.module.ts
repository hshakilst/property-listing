import {
  PropertyModel,
  PropertySchema,
} from './../common/models/property.model';
import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler/crawler.service';
import { ScraperService } from './scraper/scraper.service';
import { CronService } from './cron/cron.service';
import { HHSTexasGovSource } from './crawler/sources/hhs-texas-gov.source';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PropertyModel.name, schema: PropertySchema },
    ]),
  ],
  providers: [CrawlerService, ScraperService, CronService, HHSTexasGovSource],
  exports: [CrawlerService, ScraperService],
})
export class ServicesModule {}
