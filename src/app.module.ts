import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './config/app.config';
import { SalesLambdaModule } from './sales-lambda/sales-lambda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config]
    }),
    SalesLambdaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
