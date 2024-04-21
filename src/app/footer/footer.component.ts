import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { ThemeService } from '../services/theme.service';

@Component({
   selector: 'app-footer',
   templateUrl: './footer.component.html'
})
export class FooterComponent {
   @HostBinding('attr.ngNoHost') noHost = '';
   className: string;

   constructor(
      public theme: ThemeService,
      public setup: SetupService
   ) {

   }

   toggleAmountRendering() {
      this.setup.toggleFormat();
   }
}
