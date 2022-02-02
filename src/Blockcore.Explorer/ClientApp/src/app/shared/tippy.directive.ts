import { Directive, Input, OnInit, ElementRef } from '@angular/core';
import tippy from 'tippy.js';
import { ThemeService } from '../services/theme.service';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';

@Directive({
    /* tslint:disable-next-line */
    selector: '[tippy]'
})
export class TippyDirective implements OnInit {

    @Input('tippyOptions') public tippyOptions: Object;
    @Input('tippyType') public tippyType: string;

    constructor(
        private el: ElementRef,
        private api: ApiService,
        private setup: SetupService,
        private theme: ThemeService) {
        this.el = el;

        tippy.setDefaultProps({
            delay: [200, null],
            duration: [100, 0],
            interactiveBorder: 30,
            arrow: true,
            allowHTML: true,
            interactive: true
        });
    }

    public ngOnInit() {
        var options: any = this.tippyOptions || {};
        var element = this.el.nativeElement;
        var tippyType = this.tippyType;
        var api = this.api;

        options.theme = this.theme.darkMode ? 'light' : 'dark'; // Tooltip theme is cached, so if user changes mode it is not reflected until reload of page.
        options.content = 'Loading...';
        options.onShow = (instance: any) => {
            var address = element.innerText;
            if (tippyType === 'address') {
                api.getAddress(address).then(response => {
                    const balance = this.setup.transformFormat(response.balance);
                    instance.setContent('<div class="tooltip">Balance: <span class="number">' + balance + '</span></div>');

                }).catch(error => {
                    instance.setContent(`Request failed. ${error}`);
                });
            }
        };

        tippy(element, options);
    }
}
