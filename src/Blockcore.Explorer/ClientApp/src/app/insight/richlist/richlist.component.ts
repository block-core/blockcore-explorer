import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { SetupService } from 'src/app/services/setup.service';
import { ApiService } from 'src/app/services/api.service';
import { ScrollEvent } from 'src/app/shared/scroll.directive';

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
  blocks: any = null;

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
      await this.updateRichlist('/api/query/richlist?limit=' + this.limit);
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
    this.link = links.previous;

    // When the offset is not set (0), we should reverse the order of items.
    const list = await response.json();
    list.reverse()
    list.sort((b, a) => {
      if (a.blockIndex === b.blockIndex) {
        return 0;
      }
      if (a.blockIndex < b.blockIndex) {
        return -1;
      }
      if (a.blockIndex > b.blockIndex) {
        return 1;
      }
    });

    if (!this.blocks) {
      this.blocks = [];
    }

    this.blocks = [...this.blocks, ...list];
    this.count++;
  }

  async onScroll(event: ScrollEvent) {
    console.log('scroll occurred', event);

    if (event.isReachingBottom) {
      console.log(`the user is reaching the bottom`);

      this.loading = true;

      setTimeout(async () => {
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
