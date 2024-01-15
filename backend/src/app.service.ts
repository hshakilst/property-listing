import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { S3Service } from './providers/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PropertyModel } from './common/models/property.model';
import { Model } from 'mongoose';
import { Property } from './common/types/property.type';
import { CrawlerService } from './services/crawler/crawler.service';
import { CrawlerHelper } from './common/helpers/crawler.helper';

@Injectable()
export class AppService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    @InjectModel(PropertyModel.name)
    private readonly propertyModel: Model<PropertyModel>,
    private readonly crawlerService: CrawlerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  // Very basic way for preventing noSQL Injection
  private mongoInjection = /[\{\}\[\]\$]/g;

  async uploadImage(propertyId: string, file: Express.Multer.File) {
    try {
      if (!propertyId)
        throw new BadRequestException('propertyId cannot be empty.');
      if (file?.size < 1000)
        throw new BadRequestException('File cannot less than 1KB.');

      const key =
        this.configService.get('PUBLIC_IMAGE_STORAGE_PATH') +
        '/' +
        propertyId +
        '/' +
        Date.now() +
        '.jpg';
      await this.s3Service.putItem(file, key);
      return {
        url: this.s3Service.getPublicUrl(key),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async searchProperty(searchTerm: string): Promise<Property[]> {
    try {
      if (!searchTerm || searchTerm?.length < 3)
        throw new BadRequestException(
          `Search term 'q' can not be less than 3 characters.`,
        );

      const results = await this.propertyModel
        .find({
          $or: [
            {
              state: {
                $regex: searchTerm.replace(this.mongoInjection, ''),
                $options: 'i',
              },
            },
            {
              city: {
                $regex: searchTerm.replace(this.mongoInjection, ''),
                $options: 'i',
              },
            },
            {
              name: {
                $regex: searchTerm.replace(this.mongoInjection, ''),
                $options: 'i',
              },
            },
            {
              county: {
                $regex: searchTerm.replace(this.mongoInjection, ''),
                $options: 'i',
              },
            },
          ],
        })
        .lean()
        .exec();

      if (!results?.length) throw new NotFoundException('Results Not Found.');

      return results.map((result) => ({
        externalId: result?.externalId,
        name: result?.name,
        capacity: result?.capacity,
        city: result?.city,
        zip: result?.zip,
        state: result?.state,
        imageUrls: result?.imageUrls,
        address: result?.address,
        county: result?.county,
        phone: result?.phone,
        type: result?.type,
        source: result?.source,
        mapUrl:
          result?.source === 'hhs.texas.gov'
            ? CrawlerHelper.handleMapUrlForHhsTexasGov(result?.mapUrl)
            : result?.mapUrl,
        descriptions: result?.descriptions,
        detailsUrl:
          result?.source === 'hhs.texas.gov'
            ? 'https://apps.hhs.texas.gov/LTCSearch/' + result?.detailsUrl
            : result?.detailsUrl,
      }));
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProperty(
    externalId: string,
    type: string,
    state: string,
  ): Promise<Property> {
    try {
      if (!externalId)
        throw new BadRequestException('externalId cannot be empty.');
      if (!type) throw new BadRequestException('propType cannot be empty.');
      if (!state) throw new BadRequestException('state cannot be empty,');

      const result = await this.propertyModel
        .findOne({
          externalId: externalId.replace(this.mongoInjection, ''),
          type: type.replace(this.mongoInjection, ''),
          state: state.replace(this.mongoInjection, ''),
        })
        .lean()
        .exec();

      if (!result?._id) throw new NotFoundException('Results Not Found.');

      return {
        externalId: result?.externalId,
        name: result?.name,
        capacity: result?.capacity,
        city: result?.city,
        zip: result?.zip,
        state: result?.state,
        imageUrls: result?.imageUrls,
        address: result?.address,
        county: result?.county,
        phone: result?.phone,
        type: result?.type,
        source: result?.source,
        mapUrl:
          result?.source === 'hhs.texas.gov'
            ? CrawlerHelper.handleMapUrlForHhsTexasGov(result?.mapUrl)
            : result?.mapUrl,
        descriptions: result?.descriptions,
        detailsUrl:
          result?.source === 'hhs.texas.gov'
            ? 'https://apps.hhs.texas.gov/LTCSearch/' + result?.detailsUrl
            : result?.detailsUrl,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async controlCrawler(
    command: 'start' | 'stop',
  ): Promise<{ message: string }> {
    try {
      if (!command?.length)
        throw new BadRequestException('command cannot be empty.');
      if (command === 'start') {
        this.crawlerService.startCrawling();
        return { message: 'Crawler started successfully.' };
      }
      if (command === 'stop') {
        this.crawlerService.stopCrawling();
        return { message: 'Crawler stopped successfully.' };
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
