import { PfxHttpMethodEnum, PfxHttpService } from 'profaxnojs/axios';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SalesResponseDto } from './dto/sales-response-dto';
import { SalesProductTypeDto } from './dto/sales-product-type.dto';
import { SalesEnum } from './enum/sales.enum';

@Injectable()
export class SalesProductTypeService {
  private readonly logger = new Logger(SalesProductTypeService.name);

  private siproadSalesHost: string = null;
  private siproadSalesApiKey: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly pfxHttpService: PfxHttpService
  ) { 
    this.siproadSalesHost = this.configService.get('siproadSalesHost');
    this.siproadSalesApiKey = this.configService.get('siproadSalesApiKey');
  }

  update(dto: SalesProductTypeDto): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.PATCH;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_PRODUCT_TYPES_UPDATE);
    const headers = { "x-api-key": this.siproadSalesApiKey };
    const body    = dto;

    // * send request
    return this.pfxHttpService.request<SalesResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`update: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`update: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`update: ${error}`);
      throw error;
    })
  }

  delete(id: string): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.DELETE;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_PRODUCT_TYPES_DELETE).concat(`/${id}`);;
    const headers = { "x-api-key": this.siproadSalesApiKey };
    const body    = {};

    // * send request
    return this.pfxHttpService.request<SalesResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.CREATED || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`delete: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`delete: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`delete: ${error}`);
      throw error;
    })
  }

}
