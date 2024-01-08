import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './common/pipes/file.pipe';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('image/:propertyId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  @UsePipes(
    new FileTypeValidationPipe(['image/png', 'image/jpeg', 'image/gif']),
  )
  async uploadImage(
    // Implement Joi Validation for request params and Also Response DTO.
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.uploadImage(propertyId, file);
  }
}
