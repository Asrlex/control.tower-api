import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateRecordAndLocationId implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateRecordAndLocationId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid location/record ID format');
    }
    return value;
  }

  private validateRecordAndLocationId(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return true;
  }
}
