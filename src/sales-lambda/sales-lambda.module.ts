import { Module } from '@nestjs/common';

import { SalesLambdaService } from './sales-lambda.service';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  imports: [SalesModule],
  controllers: [],
  providers: [SalesLambdaService],
})
export class SalesLambdaModule {}
