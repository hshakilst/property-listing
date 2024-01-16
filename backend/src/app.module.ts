import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvHelper } from './common/helpers/env.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersModule } from './providers/providers.module';
import { ServicesModule } from './services/services.module';
import { PropertyModel, PropertySchema } from './common/models/property.model';
import { FileModel, FileSchema } from './common/models/file.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.test'],
      validationSchema: EnvHelper.validationSchema(),
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRoot(EnvHelper.getMongoDbUri()),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: PropertyModel.name, schema: PropertySchema },
      { name: FileModel.name, schema: FileSchema },
    ]),
    ProvidersModule,
    ServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
