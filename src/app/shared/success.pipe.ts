import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'success' })
export class SuccessPipe implements PipeTransform {
   transform(value: boolean): string {
      if (value) { // Should we be more explicit? This can give yes for more than expected.
         return 'Success';
      } else {
         return 'Failed';
      }
   }
}
