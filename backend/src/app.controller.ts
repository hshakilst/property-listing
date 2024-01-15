import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './common/pipes/file.pipe';
import { EnumValidationPipe } from './common/pipes/enum.pipe';

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

  @Get('search')
  async searchProperty(@Query('q') searchTerm: string) {
    return this.appService.searchProperty(searchTerm);
  }

  @Get('property/:externalId')
  async getProperty(
    @Param('externalId') externalId: string,
    @Query('type') type: string,
    @Query('state') state: string,
  ) {
    return this.appService.getProperty(externalId, type, state);
  }

  @Get('crawler/:command')
  async controlCrawler(
    @Param('command', new EnumValidationPipe(['start', 'stop']))
    command: 'start' | 'stop',
  ) {
    return this.appService.controlCrawler(command);
  }
}
