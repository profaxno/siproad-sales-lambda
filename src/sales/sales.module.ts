import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesCompanyService } from './sales-company.service';
import { SalesProductService } from './sales-product.service';
import { SalesProductTypeService } from './sales-product-type.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [SalesCompanyService, SalesProductService, SalesProductTypeService],
  exports: [SalesCompanyService, SalesProductService, SalesProductTypeService]
})
export class SalesModule {}
