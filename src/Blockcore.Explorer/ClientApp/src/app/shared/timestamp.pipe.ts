import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({ name: 'timestamp' })
export class TimestampPipe implements PipeTransform {
   transform(value: number): any {

      const date = moment.unix(value);
      return date.toDate();
   }
}
