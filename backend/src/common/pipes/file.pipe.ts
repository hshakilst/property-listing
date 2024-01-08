import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes: string[]) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const fileType = await import('file-type');

    if (!file) {
      throw new BadRequestException('Validation failed: No file provided');
    }

    if (!file?.originalname) {
      throw new BadRequestException(
        'Validation failed: Original file name not provided',
      );
    }

    if (!file?.mimetype) {
      throw new BadRequestException(
        'Validation failed: File mime type not provided',
      );
    }

    if (!this.allowedMimeTypes.includes(file?.mimetype)) {
      throw new BadRequestException(
        `Validation failed: File type not allowed. Allowed types: ${this.allowedMimeTypes.join(
          ', ',
        )}`,
      );
    }

    try {
      const buffer = file.buffer ? file.buffer : Buffer.alloc(0);
      const type = await fileType.fileTypeFromBuffer(buffer);

      if (!type || !this.allowedMimeTypes.includes(type.mime)) {
        throw new BadRequestException(
          `Validation failed: File type not allowed. Allowed types: ${this.allowedMimeTypes.join(
            ', ',
          )}`,
        );
      }

      return file;
    } catch (error) {
      throw new BadRequestException('Error validating file type.');
    }
  }
}
