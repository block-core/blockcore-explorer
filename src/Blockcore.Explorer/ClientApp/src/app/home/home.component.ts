import { Component, HostBinding, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // @HostBinding('class.content-centered') hostClass = true;
  tickers: any;

  constructor(
    public setup: SetupService,
    private api: ApiService,
    private router: Router) {
    // When we are not in multichain mode, redirect to chain-home.
    if (!setup.multiChain) {
      router.navigate(['/' + setup.current.toLowerCase()]);
    }
  }

  async ngOnInit() {
    await this.updateTicker();
  }

  getChangeClass(value: number) {
    if (value < 0) {
      return 'negative';
    } else {
      return 'positive';
    }
  }

  async updateTicker() {

    try {
      const coins = this.setup.chains.map(c => c.coin).filter((c) => c != null);;
      const coinList = coins.join('%2C');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinList}&vs_currencies=btc&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`

      const request = await this.api.download(url);
      this.tickers = request;
    }
    catch (err) {
      console.error(err);
    }
  }
}
