import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { SetupService } from './services/setup.service';
import { Router, ActivatedRoute, NavigationEnd, ResolveEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private api: ApiService, private setup: SetupService, private router: Router, private activatedRoute: ActivatedRoute) {
    // Initial loading.
    this.setup.getChains();
  }

  async ngOnInit() {

  }
}
