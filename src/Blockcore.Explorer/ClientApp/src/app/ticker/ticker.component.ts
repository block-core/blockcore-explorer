import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router, ActivatedRoute, NavigationEnd, ResolveEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
})
export class TickerComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-centered') hostClass = true;

  subscription: any;
  ticker: any = {};
  error: any;

  constructor(
    private api: ApiService,
    public setup: SetupService,
    private router: Router) {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigator = (obj, path) => path.split('.').reduce((a, b) => a && a[b], obj);

  async updateTicker() {

    try {
      this.error = null;
      const url = this.setup.Explorer?.Ticker?.ApiUrl;

      if (!url) {
        this.ticker = {};
        return;
      }

      const request = await this.api.download(url);

      const changePercentage = this.navigator(request, this.setup.Explorer.Ticker.PercentagePath);
      let changeType = 'neutral';

      if (changePercentage < 0) {
        changeType = 'negative';
      }

      if (changePercentage > 0) {
        changeType = 'positive';
      }

      this.ticker = {
        btc: this.navigator(request, this.setup.Explorer.Ticker.PricePathBTC),
        usd: this.navigator(request, this.setup.Explorer.Ticker.PricePathUSD),
        changePercentage,
        changeType
      };
    }
    catch (err) {
      this.ticker = { btc: null, usd: null, changePercentage: null, changeType: null };
      this.error = err;
    }
  }

  async ngOnInit() {
    this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
      await this.updateTicker();
    });
  }
}
