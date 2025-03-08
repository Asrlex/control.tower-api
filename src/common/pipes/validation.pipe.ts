import { Injectable } from '@nestjs/common';

@Injectable()
export class NoNullPipe {
  transform(value: any) {
    if (value === null) {
      throw new Error('Valor no puede ser null');
    }
    return value;
  }
}
