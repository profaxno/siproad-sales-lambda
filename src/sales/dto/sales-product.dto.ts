export class SalesProductDto {
  
  id?: string;

  companyId: string;

  name: string;

  cost: number;

  price: number;

  constructor(companyId: string, name: string, cost: number, price: number, id?: string) {
    this.companyId = companyId;
    this.name   = name;
    this.cost   = cost;
    this.price  = price;
    this.id     = id;
  }
}
