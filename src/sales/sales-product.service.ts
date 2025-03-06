import { PfxHttpMethodEnum, PfxHttpService } from 'profaxnojs/axios';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SalesResponseDto } from './dto/sales-response-dto';
import { SalesProductDto } from './dto/sales-product.dto';
import { SalesEnum } from './enum/sales.enum';

@Injectable()
export class SalesProductService {
  private readonly logger = new Logger(SalesProductService.name);

  private siproadSalesHost: string = null;
  private siproadSalesApiKey: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly pfxHttpService: PfxHttpService
  ) { 
    this.siproadSalesHost = this.configService.get('siproadSalesHost');
    this.siproadSalesApiKey = this.configService.get('siproadSalesApiKey');
  }

  updateProduct(dto: SalesProductDto): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.PATCH;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_PRODUCTS_UPDATE);
    const headers = { "x-api-key": this.siproadSalesApiKey };
    const body    = dto;

    // * send request
    return this.pfxHttpService.request<SalesResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`updateProduct: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`updateProduct: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`updateProduct: ${error}`);
      throw error;
    })
  }

  deleteProduct(id: string): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.DELETE;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_PRODUCTS_DELETE).concat(`/${id}`);;
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
        throw new Error(`deleteProduct: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`deleteProduct: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`deleteProduct: ${error}`);
      throw error;
    })
  }

}
