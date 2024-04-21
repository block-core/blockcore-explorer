import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

// TODO: Extend this with much better calculation of sizes.
@Pipe({ name: 'size' })
export class SizePipe implements PipeTransform {
   transform(value: number): string {
      return (value / 1024).toFixed(3) + 'kB';
   }
}
