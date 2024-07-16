import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService, HttpError } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';
import { ScrollEvent } from 'src/app/shared/scroll.directive';

@Component({
   selector: 'app-mempool-component',
   templateUrl: './mempool.component.html'
})
export class MempoolComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-centered-top') hostClass = true;

  info: any;
  node: any;
  blockchain: any;
  network: any;
  configuration: any;
  consensus: any;
  peers: any;
  // blocks: any;
  transactions: any;

  timerInfo: any;
  timerBlocks: any;
  timerTransactions: any;
  block: any;
  detailsVisible = false;
  lastBlockHeight: number;
  subscription: any;
  error: Error;
  loading = false;
  link: string;
  count = 0;
  limit = 20;
  total: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {

      this.transactions = null;

      try {
        

        this.error = null;
      } catch (e) {
        this.error = e;
      }

      console.log(this.block);

      // TODO: When refactoring and implementing better state management,
      // the tip should always be easily accessible, as oppose to doing this:
      const lastBlock = await this.api.getLastBlock(false);
      this.lastBlockHeight = lastBlock.blockIndex;

       try {
          await this.updateTransactions('/api/query/mempool/transactions?limit=' + this.limit);
       } catch (err) {
          if (err.message[0] === '{') {
             this.error = JSON.parse(err.message);
          } else {
             this.error = err;
          }
       }
    });
  }

  async ngOnInit() {

  }

 

  navigateToBlock(index: number) {
    // TODO: Figure out how we can navigate relative with the router. "relativeTo"?
    this.router.navigate([this.setup.current, 'explorer', 'block', index]);
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
    this.link = links['next'];

    // When the offset is not set (0), we should reverse the order of items.
    const list = await response.json();

    // list.sort((b, a) => {
    //   if (a.blockIndex === b.blockIndex) {
    //     return 0;
    //   }
    //   if (a.blockIndex < b.blockIndex) {
    //     return -1;
    //   }
    //   if (a.blockIndex > b.blockIndex) {
    //     return 1;
    //   }
    // });

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

