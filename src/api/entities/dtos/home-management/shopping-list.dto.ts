import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShoppingListProductDto {
  @IsNumber()
  @IsNotEmpty()
  readonly shoppingListProductID: number;

  @IsNumber()
  @IsNotEmpty()
  readonly shoppingListAmount: number;

  @IsNumber()
  storeID: string;
}

export class GetShoppingListProductDto {
  @IsNumber()
  @IsNotEmpty()
  shoppingListProductID: number;
  @IsNumber()
  shoppingListAmount: number;
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
  storeID: number;
  @IsString()
  storeName: string;
  @IsNumber()
  tagID: number;
  @IsString()
  tagName: string;
  @IsString()
  tagType: string;
}
