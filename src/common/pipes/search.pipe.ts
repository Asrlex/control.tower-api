import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SearchCriteriaDto } from 'src/common/pipes/search-criteria.dto';

@Injectable()
export class ValidateSearchCriteriaPipe implements PipeTransform {
  async transform(value: any) {
    if (value === undefined || value === null) {
      return false;
    }
    const searchCriteria = JSON.parse(decodeURIComponent(value));
    const searchCriteriaDto = plainToInstance(
      SearchCriteriaDto,
      searchCriteria,
    );
    const errors = await validate(searchCriteriaDto);

    if (errors.length > 0) {
      throw new BadRequestException('Validation of SearchCriteria failed');
    }
    return value;
  }
}
