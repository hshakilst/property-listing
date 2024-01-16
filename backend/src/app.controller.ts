import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './common/pipes/file.pipe';
import { EnumValidationPipe } from './common/pipes/enum.pipe';

@ApiTags('Property')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  //! Upload Image Swagger Configuration
  @ApiOperation({ summary: 'Uploads a Image to S3 bucket for a Property' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'externalId',
    schema: {
      example: '106705',
    },
  })
  @ApiQuery({
    name: 'source',
    schema: {
      example: 'hhs.texas.gov',
    },
  })
  @ApiQuery({
    name: 'type',
    schema: {
      example: 'Assisted Living Type B',
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      example: {
        url: 'https://property-listing.s3.us-west-1.amazonaws.com/images/hhs.texas.gov/Home+Health+Agency/016836/IMG_1134_sd.jpg',
      },
    },
  })
  @Post('upload/:externalId')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }),
  )
  //! Upload Image Function
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

  //! Search Property Swagger Configuration
  @ApiOperation({
    summary:
      'Search the Database by name/city/state. *Warning be careful using state as a query if the DB is populated (may hang the page).',
  })
  @ApiQuery({
    name: 'q',
    example: 'Austin',
  })
  @ApiResponse({
    schema: {
      example: [
        {
          externalId: '017190',
          name: '1st Texas Home Health',
          capacity: 0,
          city: 'Sealy',
          zip: '77474',
          state: 'Texas',
          imageUrls: [
            'https://property-listing.s3.us-west-1.amazonaws.com/images/hhs.texas.gov/Home+Health+Agency/016836/IMG_1134_sd.jpg',
          ],
          address: '324 MEYER',
          county: 'Austin',
          phone: '979-877-0900',
          type: 'Home Health Agency',
          source: 'hhs.texas.gov',
          mapUrl:
            'https://www.google.com/maps/embed/v1/place?key=AIzaSyBZF8RwjhXobKAGSfq5ZEpVMdGkVRROGZA&q=324+MEYER,+Sealy,+TX+77474',
          descriptions: ['Accepts Medicare: Yes'],
          detailsUrl:
            'https://apps.hhs.texas.gov/LTCSearch/providerdetail.cfm?pid=017190&protype=Home Health&subtype=&lang=EN',
        },
      ],
    },
  })
  @Get('search')
  //! Search Property Function
  async searchProperty(@Query('q') searchTerm: string) {
    return this.appService.searchProperty(searchTerm);
  }

  //! Get Property Swagger Configuration
  @ApiOperation({
    summary: 'Get one property from the DB.',
  })
  @ApiParam({
    name: 'externalId',
    schema: {
      example: '106705',
    },
  })
  @ApiQuery({
    name: 'source',
    schema: {
      example: 'hhs.texas.gov',
    },
  })
  @ApiQuery({
    name: 'type',
    schema: {
      example: 'Assisted Living Type B',
    },
  })
  @ApiResponse({
    schema: {
      example: {
        externalId: '106705',
        name: 'The Delaney at Georgetown Village',
        capacity: 97,
        city: 'Georgetown',
        zip: '78633',
        state: 'Texas',
        imageUrls: [],
        address: '359 VILLAGE COMMONS BOULEVARD',
        county: 'Williamson',
        phone: '512-819-9500',
        type: 'Assisted Living Type B',
        source: 'hhs.texas.gov',
        mapUrl:
          'https://www.google.com/maps/embed/v1/place?key=AIzaSyBZF8RwjhXobKAGSfq5ZEpVMdGkVRROGZA&q=359+VILLAGE+COMMONS+BOULEVARD,+Georgetown,+TX+78633',
        descriptions: [
          'Service Type: Type B',
          'Total Bed Count: 97',
          'Alzheimer Certification: Yes',
        ],
        detailsUrl:
          'https://apps.hhs.texas.gov/LTCSearch/providerdetail.cfm?pid=106705&protype=Assisted Living&subtype=TYPE B&lang=EN',
      },
    },
  })
  @Get('property/:externalId')
  //! Get Property Function
  async getProperty(
    @Param('externalId') externalId: string,
    @Query('type') type: string,
    @Query('source') source: string,
  ) {
    return this.appService.getProperty(externalId, type, source);
  }

  //! Control Crawler Swagger Configuration
  @ApiOperation({
    summary:
      'Start or Stop the Crawler Service. Crawler Service Also Starts at Midnight 5 AM.',
  })
  @ApiParam({
    name: 'command',
    schema: {
      type: 'string',
      enum: ['start', 'stop'],
      example: 'start',
    },
  })
  @ApiResponse({
    schema: {
      example: {
        message: 'Crawler started successfully.',
      },
    },
  })
  @Get('crawler/:command')
  //! Control Crawler Function
  async controlCrawler(
    @Param('command', new EnumValidationPipe(['start', 'stop']))
    command: 'start' | 'stop',
  ) {
    return this.appService.controlCrawler(command);
  }
}
