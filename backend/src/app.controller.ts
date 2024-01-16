import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './common/pipes/file.pipe';
import { EnumValidationPipe } from './common/pipes/enum.pipe';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload/:externalId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  async uploadImage(
    // Implement Joi Validation for request params and Also Response DTO.
    @Param('externalId') externalId: string,
    @Query('source') source: string,
    @Query('type') type: string,
    @UploadedFile(
      new FileTypeValidationPipe(
        ['image/png', 'image/jpeg'],
        ['.jpg', '.jpeg', '.png'],
      ),
    )
    file: Express.Multer.File,
  ) {
    return this.appService.uploadImage(externalId, type, source, file);
  }

  @Get('search')
  async searchProperty(@Query('q') searchTerm: string) {
    return this.appService.searchProperty(searchTerm);
  }

  @Get('property/:externalId')
  async getProperty(
    @Param('externalId') externalId: string,
    @Query('type') type: string,
    @Query('source') source: string,
  ) {
    return this.appService.getProperty(externalId, type, source);
  }

  @Get('crawler/:command')
  async controlCrawler(
    @Param('command', new EnumValidationPipe(['start', 'stop']))
    command: 'start' | 'stop',
  ) {
    return this.appService.controlCrawler(command);
  }
}
