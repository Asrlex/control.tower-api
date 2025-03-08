import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePaginationPipe implements PipeTransform {
  transform(value: any) {
    const isValid = this.validatePagination(value);
    if (!isValid) {
      throw new BadRequestException('Invalid pagination format');
    }
    return value;
  }

  private validatePagination(value: any): boolean {
    if (isNaN(value) || value < 0 || !Number.isInteger(parseFloat(value))) {
      return false;
    }
    return true;
  }
}
