import { IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  tagName: string;
  @IsString()
  tagType: string;
}

export class GetTagDto {
  @IsNumber()
  tagID: number;
  @IsString()
  tagName: string;
  @IsString()
  tagType: string;
}

export class CreateItemTagDto {
  @IsString()
  tagID: string;
  @IsString()
  itemID: string;
}
