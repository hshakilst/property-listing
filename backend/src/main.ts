import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Setup Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Property Listing')
    .setDescription(
      'Assessment Task for BoomersHub. Currently only crawls hhs.texas.gov. Total Number of Records for hhs.texas.gov: 11961 (Last: 2024-01-11)',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
