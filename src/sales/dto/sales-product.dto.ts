export class SalesProductDto {
  
  id?: string;

  companyId: string;

  name: string;

  price: number;

  constructor(companyId: string, name: string, price: number, id?: string) {
    this.companyId = companyId;
    this.name = name;
    this.price = price;
    this.id = id;
  }
}
