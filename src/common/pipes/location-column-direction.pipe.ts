import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateLocationColumnDirectionPipe implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateLocationColumnDirection(value);
    if (!isValid) {
      throw new BadRequestException(
        'Invalid location dolumn direction (+1/-1)',
      );
    }
    return value;
  }

  private validateLocationColumnDirection(value: any): boolean {
    if (value === undefined || value === null) {
      return true;
    }
    const direction = decodeURIComponent(value);
    if (!['-1', '+1'].includes(direction)) {
      return false;
    }
    return true;
  }
}
