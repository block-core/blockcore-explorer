import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

export function debounce(delay: number = 300): MethodDecorator {
   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

      const original = descriptor.value;
      const key = `__timeout__${propertyKey}`;

      descriptor.value = function (...args) {
         clearTimeout(this[key]);
         this[key] = setTimeout(() => original.apply(this, args), delay);
      };

      return descriptor;
   };
}

export interface ScrollEvent {
   isReachingBottom: boolean;
   isReachingTop: boolean;
   originalEvent: Event;
   isWindowEvent: boolean;
}

declare const window: Window;

@Directive({
   selector: '[appDetectScroll]'
})
export class ScrollDirective {
   @Output() public onScroll = new EventEmitter<ScrollEvent>();
   @Input() public bottomOffset = 100;
   @Input() public topOffset = 100;

   constructor() { }

   throttle(fn, wait) {
      let time = Date.now();
      return function () {
         if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
         }
      };
   }

   @HostListener('scroll', ['$event'])
   @debounce(100)
   public scrolled($event: Event) {
      // this.throttle(this.windowScrollEvent($event), 10000);
      this.elementScrollEvent($event);
   }

   @HostListener('window:scroll', ['$event'])
   @debounce(100)
   public windowScrolled($event: Event) {
      // this.throttle(this.windowScrollEvent($event), 10000);
      this.windowScrollEvent($event);
   }

   protected windowScrollEvent($event: Event) {
      const target = <Document>$event.target;

      if (!target || !target.body) {
         return;
      }

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const isReachingTop = scrollTop < this.topOffset;
      const isReachingBottom = (target.body.offsetHeight - (window.innerHeight + scrollTop)) < this.bottomOffset;
      const emitValue: ScrollEvent = { isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: true };
      this.onScroll.emit(emitValue);
   }

   protected elementScrollEvent($event: Event) {
      const target = <HTMLElement>$event.target;

      if (!target) {
         return;
      }

      const scrollPosition = target.scrollHeight - target.scrollTop;
      const offsetHeight = target.offsetHeight;
      const isReachingTop = target.scrollTop < this.topOffset;
      const isReachingBottom = (scrollPosition - offsetHeight) < this.bottomOffset;
      const emitValue: ScrollEvent = { isReachingBottom, isReachingTop, originalEvent: $event, isWindowEvent: false };
      this.onScroll.emit(emitValue);
   }
}
