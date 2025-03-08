import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateLocationId implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateLocationId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid location ID format');
    }
    return value;
  }

  private validateLocationId(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    return true;
  }
}
