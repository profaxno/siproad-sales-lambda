import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalesService } from './sales.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
