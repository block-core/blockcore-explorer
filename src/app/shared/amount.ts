import { Pipe, PipeTransform } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Pipe({ name: 'amount', pure: false })
export class AmountPipe implements PipeTransform {

   constructor(public setup: SetupService) {

   }

   transform(value: number): string {
      return this.setup.transformFormat(value);
   }
}

@Pipe({ name: 'amountHtml', pure: false })
export class AmountMarkdownPipe implements PipeTransform {

   constructor(public setup: SetupService) {

   }

   transform(value: number): string {
      const amount = this.setup.transformFormat(value);

      if (amount.indexOf('.') > -1) {
         const amounts = amount.split('.');
         return `${amounts[0]}.<span class="decimals">${amounts[1]}</span>`;
      } else {
         return amount;
      }
   }
}
