import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvHelper } from './common/helpers/env.helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: EnvHelper.determineEnvFilePath(),
      validationSchema: EnvHelper.validationSchema(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
