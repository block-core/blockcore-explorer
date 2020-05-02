import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ScrollEvent } from 'src/app/shared/scroll.directive';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';

@Component({
  selector: 'app-blocks-component',
  templateUrl: './blocks.component.html'
})
export class BlocksComponent implements OnInit, OnDestroy {
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

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    console.log('Scroll Event');
  }

  constructor(private api: ApiService, private setup: SetupService) {

  }

  async ngOnInit() {
    this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
      await this.updateBlocks('/api/query/block?transactions=false&limit=' + this.limit);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timerInfo);
    clearTimeout(this.timerBlocks);
    this.subscription.unsubscribe();
  }

  async updateBlocks(url) {
    const baseUrl = this.api.baseUrl.replace('/api', '');
    // For the block scrolling (using link http header), we must manually set full URL.
    const response = await this.api.request(baseUrl + url);

    const linkHeader = response.headers.get('link');
    const links1 = linkHeader.split(', <');
    const links2 = links1[2].split('>; ');
    const link = links2[0];

    this.link = link;

    // When the offset is not set (0), we should reverse the order of items.
    const list = await response.json();

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
        await this.updateBlocks(this.link);
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

