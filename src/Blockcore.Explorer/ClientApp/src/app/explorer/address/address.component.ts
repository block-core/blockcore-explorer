import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';
import { ScrollEvent } from 'src/app/shared/scroll.directive';

@Component({
  selector: 'app-address-component',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-centered-top') hostClass = true;

  info: any;
  node: any;
  blockchain: any;
  network: any;
  configuration: any;
  consensus: any;
  peers: any;
  blocks: any;
  transactions: any;

  timerInfo: any;
  timerBlocks: any;
  timerTransactions: any;
  address: any;
  balance: any;
  detailsVisible = false;
  lastBlockHeight: number;
  subscription: any;
  limit = 10;
  loading = false;
  count = 0;
  total: any;
  link: string;

  constructor(
    private api: ApiService,
    private router: Router,
    public setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {
      const id: any = params.get('address');
      console.log('Address:', id);

      this.transactions = null;

      this.address = id;
      this.balance = await this.api.getAddress(id);
      console.log(this.balance);

      await this.updateTransactions('/api/query/address/' + id + '/transactions?limit=' + this.limit);
    });
  }

  amount(outputs: any) {
    const amount = outputs.reduce((acc, item) => acc + item.balance, 0);
    return amount;
  }

  async ngOnInit() {

  }

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
  }

  ngOnDestroy(): void {

  }

  async updateTransactions(url) {
    // If no URL, then likely reached the end.
    if (!url) {
      return;
    }

    const baseUrl = this.api.baseUrl.replace('/api', '');
    // For the block scrolling (using link http header), we must manually set full URL.
    const response = await this.api.request(baseUrl + url);

    this.total = response.headers.get('Pagination-Total');
    const linkHeader = response.headers.get('Link');
    const links = this.api.parseLinkHeader(linkHeader);

    // This will be set to undefined/null when no more next links is available.
    this.link = links['previous'];

    // When the offset is not set (0), we should reverse the order of items.
    const list = await response.json();

    if (!this.transactions) {
      this.transactions = [];
    }

    this.transactions = [...this.transactions, ...list];
    this.count++;
  }

  async onScroll(event: ScrollEvent) {
    console.log('scroll occurred', event);

    if (event.isReachingBottom) {
      console.log(`the user is reaching the bottom`);

      this.loading = true;

      setTimeout(async () => {
        await this.updateTransactions(this.link);
        this.loading = false;
      });

    }
    if (event.isReachingTop) {
      console.log(`the user is reaching the top`);
    }
    if (event.isWindowEvent) {
      console.log(`This event is fired on Window not on an element.`);
    }
  }
}

