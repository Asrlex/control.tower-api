import { IsNumber, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  storeName: string;
}

export class GetStoreDto {
  @IsNumber()
  storeID: number;
  @IsString()
  storeName: string;
}
