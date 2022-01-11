import { Pipe, PipeTransform } from '@angular/core';
import * as satcomma from 'satcomma';
import { SetupService } from '../services/setup.service';

@Pipe({ name: 'amount', pure: false })
export class AmountPipe implements PipeTransform {

   constructor(public setup: SetupService) {

   }

   transform(value: number): string {
      if (this.setup.format == 'sat') {
         return value.toString();
      }
      else if (this.setup.format == 'bitcoin') {
         return (value / 100000000).toFixed(8);
      }
      else {
         const formatted = satcomma.fromSats(value, { validateBitcoinMaxSupply: false });
         const values = formatted.split('.');
         return (+values[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }) + '.' + values[1];
      }
   }
}
