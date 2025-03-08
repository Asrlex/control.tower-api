import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  stockProductName: string;
  @IsString()
  stockProductUnit: string;
}

export class GetProductDto {
  @IsNumber()
  productID: number;
  @IsString()
  productName: string;
  @IsString()
  productUnit: string;
  @IsString()
  productDateLastBought: string;
  @IsString()
  productDateLastConsumed: string;
  @IsNumber()
  tagID: number;
  @IsString()
  tagName: string;
  @IsString()
  tagType: string;
}
