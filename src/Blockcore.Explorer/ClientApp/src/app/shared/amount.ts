import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
   transform(value: number): string {
      return (value / 100000000).toFixed(8);
   }
}
