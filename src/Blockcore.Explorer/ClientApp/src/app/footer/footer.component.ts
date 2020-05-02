import { Component, OnDestroy, Renderer2, HostBinding } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';

@Component({
   selector: 'app-footer',
   templateUrl: './footer.component.html'
})
export class FooterComponent {
   @HostBinding('attr.ngNoHost') noHost = '';
   className: string;

   constructor(
      private renderer: Renderer2,
      public setup: SetupService
   ) {
      this.updateMode();
   }

   get darkMode(): boolean {
      return (localStorage.getItem('dark-mode') === 'on');
   }

   set darkMode(value: boolean) {
      if (value) {
         localStorage.setItem('dark-mode', 'on');
      } else {
         localStorage.setItem('dark-mode', 'off');
      }

      this.updateMode();
   }

   toggle() {
      // Toggle the dark mode.
      this.darkMode = !this.darkMode;

      // const trans = () => {
      //    document.documentElement.classList.add('transition');
      //    window.setTimeout(() => {
      //       document.documentElement.classList.remove('transition');
      //    }, 500);
      // };
      // trans();

      // Update the UI.
      this.updateMode();
   }

   updateMode() {
      if (this.darkMode) {
         this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark'); //  .addClass(document.body, 'dark');
      } else {
         this.renderer.setAttribute(document.documentElement, 'data-theme', 'light');
         // this.renderer.removeClass(document.body, 'dark');
      }
   }
}
