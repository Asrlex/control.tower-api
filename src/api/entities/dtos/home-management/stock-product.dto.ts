import { IsNumber, IsString } from 'class-validator';

export class CreateStockProductDto {
  @IsNumber()
  stockProductID: number;
  @IsNumber()
  stockProductAmount: number;
}

export class GetStockProductDto {
  @IsNumber()
  stockProductID: number;
  @IsNumber()
  stockProductAmount: number;
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
