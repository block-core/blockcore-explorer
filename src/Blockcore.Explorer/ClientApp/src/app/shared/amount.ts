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
