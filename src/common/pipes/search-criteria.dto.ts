import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FilterI {
  @IsString()
  field: string;

  @IsString()
  value: string;

  @IsString()
  operator:
    | '<'
    | '<='
    | '='
    | '>'
    | '>='
    | 'like'
    | 'in'
    | 'between'
    | 'LIKE'
    | 'IN'
    | 'BETWEEN';
}

class SortI {
  @IsString()
  field: string;

  @IsString()
  order: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export class SearchCriteriaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterI)
  filters: FilterI[];

  @IsString()
  @IsOptional()
  search: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortI)
  sort: SortI[];
}
