import { Component, Input, OnChanges } from '@angular/core';
import { HttpError } from '../services/api.service';

@Component({
   selector: 'app-error',
   templateUrl: './error.component.html'
})
export class ErrorComponent implements OnChanges {
   @Input() error;
   message: string;
   details: string;
   stack: string;
   detailsVisible = false;

   ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
      if (!this.error) {
         return;
      }

      if (this.error instanceof HttpError) {

         if (this.error.code === 404) {
            this.message = 'Not found (404)';
            this.details = this.error.url;
            this.stack = this.error.stack.toString();
         } else {
            this.message = this.error.message + ' (' + this.error.code + ')';
            this.details = this.error.url;
            this.stack = this.error.stack.toString();
         }
      } else if (this.error instanceof Error) {
         this.message = 'Error occured: ' + this.error.message;
         this.stack = this.error.stack.toString();
      } else {
         this.message = this.error;
      }
   }
}
