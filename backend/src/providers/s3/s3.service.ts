import { Injectable, Logger } from '@nestjs/common';
// The following import is to use the Express.Multer.File type. For more information,
// see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780#issuecomment-1321248245
import 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET_NAME');
  }

  // Upload an item
  async putItem(file: Express.Multer.File, key: string): Promise<number> {
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });

      const response = await this.s3Client.send(uploadCommand);

      return response?.$metadata?.httpStatusCode;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Get a publicly accessible URL
  getPublicUrl(key: string): string {
    // AWS Automatically Handles Spaces( ) with plus(+)
    return `https://${this.bucket}.s3.${
      process.env.AWS_REGION
    }.amazonaws.com/${key.replace(/\s/g, '+')}`;
  }
}
