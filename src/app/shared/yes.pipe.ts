import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'yes' })
export class YesPipe implements PipeTransform {
   transform(value: boolean): string {
      if (value) { // Should we be more explicit? This can give yes for more than expected.
         return 'Yes';
      } else {
         return 'No';
      }
   }
}
