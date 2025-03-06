import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";

export class SalesProductTypeDto {
  
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  companyId: string;

  @IsString()
  @MaxLength(45)
  label: string;

  constructor(companyId: string, label: string, id?: string) {
    this.companyId = companyId;
    this.label = label;
    this.id = id;
  }
}
