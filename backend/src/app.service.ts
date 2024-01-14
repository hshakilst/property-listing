import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { S3Service } from './providers/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PropertyModel } from './common/models/property.model';
import { Model } from 'mongoose';
import { Property } from './common/types/property.type';
import { CrawlerService } from './services/crawler/crawler.service';

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

  async uploadImage(propertyId: string, file: Express.Multer.File) {
    try {
      if (!propertyId?.length)
        throw new BadRequestException('propertyId cannot be empty.');
      if (!file?.size) throw new BadRequestException('File cannot be empty.');

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
    }
  }

  async searchProperty(searchTerm: string): Promise<Property[]> {
    try {
      if (!searchTerm?.length || searchTerm?.length < 3)
        throw new BadRequestException(
          'Search term can not be less than 3 characters.',
        );

      const results = await this.propertyModel
        .find({
          $or: [
            { state: { $regex: searchTerm, $options: 'i' } },
            { city: { $regex: searchTerm, $options: 'i' } },
            { name: { $regex: searchTerm, $options: 'i' } },
            { county: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .lean()
        .exec();

      if (!results?.length) return [];

      return results.map((result) => ({
        externalId: result.externalId,
        name: result.name,
        capacity: result.capacity,
        city: result.city,
        zip: result.zip,
        state: result.state,
        imageUrls: result.imageUrls,
        address: result.address,
        county: result.county,
        phone: result.phone,
        type: result.type,
        source: result.source,
        mapUrl: result.mapUrl,
        descriptions: result.descriptions,
      }));
    } catch (error) {
      this.logger.error(error);
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
    }
  }
}
