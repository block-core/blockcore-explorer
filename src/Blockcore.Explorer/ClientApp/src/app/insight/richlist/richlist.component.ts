import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { SetupService } from '../../services/setup.service';
import { ApiService } from '../../services/api.service';
import { ScrollEvent } from '../../shared/scroll.directive';

@Component({
  selector: 'app-richlist',
  templateUrl: './richlist.component.html',
  styleUrls: ['./richlist.component.css', '../insight.component.css']
})
export class RichlistComponent implements OnInit {
  @HostBinding('class.content-centered-top') hostClass = true;

  info: any;
  node: any;
  blockchain: any;
  network: any;
  configuration: any;
  consensus: any;
  peers: any;
  addresses: any = null;
  timerInfo: any;
  timerBlocks: any;
  count = 0;
  maxCount = 2;
  link: string;
  limit = 20;
  loading = false;
  subscription: any;
  total: any;

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.log('Scroll Event');
  }
  constructor(private api: ApiService, public setup: SetupService) { }

  ngOnInit(): void {
    this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
      // await this.api.getRichlist(0, this.limit);
      // return this.downloadRelative('/insight/richlist?offset=' + offset + '&limit=' + limit);
      await this.updateRichlist('/api/insight/richlist?limit=' + this.limit);
    });
  }

  async updateRichlist(url) {
    console.log('url: ', url);

    if (!url) {
      return;
    }

    const baseUrl = this.api.baseUrl.replace('/api', '');
    // For the block scrolling (using link http header), we must manually set full URL.
    const response = await this.api.request(baseUrl + url);

    this.total = response.headers.get('Pagination-Total');
    const linkHeader = response.headers.get('Link');
    const links = this.api.parseLinkHeader(linkHeader);

    // This will be set to undefined/null when no more previous links is available.
    this.link = links.next;

    const list = await response.json();

    if (!this.addresses) {
      this.addresses = [];
    }

    this.addresses = [...this.addresses, ...list];
    this.count++;
  }

  async onScroll(event: ScrollEvent) {
    console.log('scroll occurred', event);

    if (event.isReachingBottom) {
      console.log(`the user is reaching the bottom`);

      this.loading = true;

      setTimeout(async () => {
        console.log('UPDATE RICH LIST', this.link);
        await this.updateRichlist(this.link);
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
