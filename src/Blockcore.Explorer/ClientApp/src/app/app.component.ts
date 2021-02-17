import { Component, OnInit, Renderer2 } from '@angular/core';
import { ApiService } from './services/api.service';
import { SetupService } from './services/setup.service';
import { Router, ActivatedRoute, NavigationEnd, ResolveEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    private api: ApiService,
    private setup: SetupService,
    private theme: ThemeService,
    private router: Router,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute) {

    this.theme.init(renderer);

    // Initial loading.
    this.setup.getChains();
  }

  async ngOnInit() {

  }
}
