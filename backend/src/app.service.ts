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
import { FileModel } from './common/models/file.model';

@Injectable()
export class AppService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
    @InjectModel(PropertyModel.name)
    private readonly propertyModel: Model<PropertyModel>,
    @InjectModel(FileModel.name)
    private readonly fileModel: Model<FileModel>,
    private readonly crawlerService: CrawlerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  //! Very basic way for preventing noSQL Injection. Do not include dot(.)
  private mongoInjection = /[\{\}\[\]\$]/g;

  async uploadImage(
    externalId: string,
    type: string,
    source: string,
    file: Express.Multer.File,
  ) {
    try {
      if (!externalId)
        throw new BadRequestException('externalId cannot be empty.');
      if (!type) throw new BadRequestException('type cannot be empty.');
      if (!source) throw new BadRequestException('source cannot be empty.');

      const property = await this.propertyModel
        .findOne({
          externalId: externalId.replace(this.mongoInjection, ''),
          type: type.replace(this.mongoInjection, ''),
          source: source.replace(this.mongoInjection, ''),
        })
        .exec();

      if (!property?._id) throw new NotFoundException('Property not found.');

      const key =
        this.configService.get('PUBLIC_IMAGE_STORAGE_PATH') +
        `/${source}` +
        `/${type}` +
        `/${externalId}` +
        //! Need to sanitize the file name
        `/${file.originalname.replace(/\s/g, '+')}`;

      const statusCode = await this.s3Service.putItem(file, key);

      if (statusCode !== 200)
        throw new BadRequestException('File Upload Failed.');

      const publicUrl = this.s3Service.getPublicUrl(key);

      await this.fileModel.updateOne(
        {
          externalId: property?.id,
          key: key,
        },
        {
          externalId: property?.id,
          key: key,
          name: file?.originalname,
          size: file?.size,
          mimeType: file?.mimetype,
          url: publicUrl,
        },
        {
          upsert: true,
        },
      );

      if (!property.imageUrls?.includes(publicUrl))
        property.imageUrls.push(publicUrl);
      await property.save();

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
    source: string,
  ): Promise<Property> {
    try {
      if (!externalId)
        throw new BadRequestException('externalId cannot be empty.');
      if (!type) throw new BadRequestException('propType cannot be empty.');
      if (!source) throw new BadRequestException('source cannot be empty,');

      const result = await this.propertyModel
        .findOne({
          externalId: externalId.replace(this.mongoInjection, ''),
          type: type.replace(this.mongoInjection, ''),
          source: source.replace(this.mongoInjection, ''),
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
