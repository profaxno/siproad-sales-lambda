export class SalesProductTypeDto {
  
  id?: string;

  companyId: string;

  name: string;

  constructor(companyId: string, name: string, id?: string) {
    this.companyId = companyId;
    this.name = name;
    this.id = id;
  }
}
