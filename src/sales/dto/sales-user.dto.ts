export class SalesUserDto {
  
  id?: string;

  companyId: string;

  name: string;

  email: string;;

  status?: number;
  
  constructor(companyId: string, name: string, email: string, id?: string, status?: number) {
    this.companyId = companyId;
    this.name = name;
    this.email = email;
    this.id = id;
    this.status = status;
  }
}