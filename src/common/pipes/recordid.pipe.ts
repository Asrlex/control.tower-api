import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateRecordIdPipe implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateRecordID(value);
    if (!isValid) {
      throw new BadRequestException('Invalid record ID format');
    }
    return value;
  }

  private validateRecordID(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    const idRegex = /^\d{8}$/i;
    return idRegex.test(value);
  }
}
