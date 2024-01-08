import { Injectable } from '@nestjs/common';
import { S3Service } from './providers/s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(propertyId: string, file: Express.Multer.File) {
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
  }
}
