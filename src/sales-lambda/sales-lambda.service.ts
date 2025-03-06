import { ProcessSummaryDto } from 'profaxnojs/util';

import { Injectable, Logger } from '@nestjs/common';

import { MessageDto } from './dto/data-replication.dto';
import { ProcessEnum, SourceEnum } from './enum';
import { Record, Event, Body } from './interface';

import { SalesCompanyDto, SalesProductDto } from 'src/sales/dto';
import { SalesResponseDto } from 'src/sales/dto/sales-response-dto';
import { SalesCompanyService } from 'src/sales/sales-company.service';
import { SalesProductService } from 'src/sales/sales-product.service';

@Injectable()
export class SalesLambdaService {

  private readonly logger = new Logger(SalesLambdaService.name);

  constructor(
    private readonly salesCompanyService: SalesCompanyService,
    private readonly salesProductService: SalesProductService
  ) {}

  async processEvent(event: Event): Promise<any> {
    const start = performance.now();
    
    const recordsSize = event.Records ? event.Records.length : 0;
     
    //let successfulMessages: string[] = [];
    let failedMessages: { itemIdentifier: string }[] = [];
    let processSummaryDto = new ProcessSummaryDto(event.Records.length);

    if(recordsSize == 0) {
      this.logger.log(`processEvent: not executed (list empty)`);
      return { batchItemFailures: failedMessages };
    }

    this.logger.log(`processEvent: starting process... recordsSize=${recordsSize}`);

    let i = 0;
    for (const record of event.Records) {
      this.logger.warn(`[${i}] processEvent: processing message, messageId=${record.messageId}`);

      await this.processMessage(record)
      .then( (responseDto: SalesResponseDto) => {
        processSummaryDto.rowsOK++;
        processSummaryDto.detailsRowsOK.push(`[${i}] messageId=${record.messageId}, response=${responseDto.message}`);
        this.logger.log(`[${i}] processEvent: message processed, messageId=${record.messageId}`);
      })
      .catch( (error) => {
        processSummaryDto.rowsKO++;
        processSummaryDto.detailsRowsKO.push(`[${i}] messageId=${record.messageId}, error=${error.message}`);
        this.logger.error(`[${i}] processEvent: error processing message, messageId=${record.messageId}, error`, error.message);
        failedMessages.push({ itemIdentifier: record.messageId });
      })
      .finally( () => {
        i++;
      })

    }

    const end = performance.now();
    this.logger.log(`processEvent: executed, runtime=${(end - start) / 1000} seconds, summary=${JSON.stringify(processSummaryDto)}`);
    
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: 'Event processed successfully' }),
    // };

    return { batchItemFailures: failedMessages };
  }

  private processMessage(record: Record): Promise<SalesResponseDto> {
    try {
      const body: Body = JSON.parse(record.body);
      const messageDto: MessageDto = JSON.parse(body.Message);

      // * replicate companies to sales
      if(messageDto.process == ProcessEnum.COMPANY_UPDATE) {
        const dto: SalesCompanyDto = JSON.parse(messageDto.jsonData);

        return this.salesCompanyService.updateCompany(dto)
        .then( (responseDto: SalesResponseDto) => {
          return responseDto;
        })
      }

      if(messageDto.process == ProcessEnum.COMPANY_DELETE) {
        const dto: SalesCompanyDto = JSON.parse(messageDto.jsonData);

        return this.salesCompanyService.deleteCompany(dto.id)
        .then( (responseDto: SalesResponseDto) => {
          return responseDto;
        })
      }
      
      // * replicate products to sales
      if(messageDto.process == ProcessEnum.PRODUCT_UPDATE) {
        const dto: SalesProductDto = JSON.parse(messageDto.jsonData);

        return this.salesProductService.updateProduct(dto)
        .then( (responseDto: SalesResponseDto) => {
          return responseDto;
        })
      }

      if(messageDto.process == ProcessEnum.PRODUCT_DELETE) {
        const dto: SalesProductDto = JSON.parse(messageDto.jsonData);

        return this.salesProductService.deleteProduct(dto.id)
        .then( (responseDto: SalesResponseDto) => {
          return responseDto;
        })
      }
    
      throw new Error(`process not implemented, source=${messageDto.source}, process=${messageDto.process}`);
      
    } catch (error) {
      throw error;
    }
  }

}
