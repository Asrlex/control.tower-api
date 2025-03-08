import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateOrderIdPipe implements PipeTransform {
  transform(value: any) {
    const isValid = this.validateOrderId(value);
    if (!isValid) {
      throw new BadRequestException('Invalid order ID format');
    }
    return value;
  }

  private validateOrderId(uuid: string): boolean {
    if (uuid === undefined || uuid === null) {
      return false;
    }
    const uuidRegex = /^.*\.\d{4}\.\d{4}\.\d$/i;
    return uuidRegex.test(uuid);
  }
}
