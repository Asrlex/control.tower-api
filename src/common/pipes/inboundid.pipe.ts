import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateInboundIdPipe implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateInboundID(value);
    if (!isValid) {
      throw new BadRequestException('Invalid record ID format');
    }
    return value;
  }

  private validateInboundID(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    const idRegex = /^\d{6}$/i;
    return idRegex.test(value);
  }
}
