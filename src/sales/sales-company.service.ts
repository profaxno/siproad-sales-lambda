import { PfxHttpMethodEnum, PfxHttpService } from 'profaxnojs/axios';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SalesResponseDto } from './dto/sales-response-dto';
import { SalesCompanyDto } from './dto/sales-company.dto';
import { SalesEnum } from './enum/sales.enum';

@Injectable()
export class SalesCompanyService {
  private readonly logger = new Logger(SalesCompanyService.name);

  private siproadSalesHost: string = null;
  private siproadSalesApiKey: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly pfxHttpService: PfxHttpService
  ) { 
    this.siproadSalesHost = this.configService.get('siproadSalesHost');
    this.siproadSalesApiKey = this.configService.get('siproadSalesApiKey');
  }

  updateCompany(dto: SalesCompanyDto): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.PATCH;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_COMPANY_UPDATE);
    const headers = { "x-api-key": this.siproadSalesApiKey };
    const body    = dto;

    // * send request
    return this.pfxHttpService.request<SalesResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`updateCompany: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`updateCompany: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`updateCompany: ${error}`);
      throw error;
    })
  }

  deleteCompany(id: string): Promise<SalesResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.DELETE;
    const path    = this.siproadSalesHost.concat(SalesEnum.PATH_COMPANY_DELETE).concat(`/${id}`);;
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
        throw new Error(`deleteCompany: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`deleteCompany: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`deleteCompany: ${error}`);
      throw error;
    })
  }

}
