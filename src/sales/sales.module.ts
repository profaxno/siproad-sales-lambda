import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesCompanyService } from './sales-company.service';
import { SalesProductService } from './sales-product.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [SalesCompanyService, SalesProductService],
  exports: [SalesCompanyService, SalesProductService]
})
export class SalesModule {}
