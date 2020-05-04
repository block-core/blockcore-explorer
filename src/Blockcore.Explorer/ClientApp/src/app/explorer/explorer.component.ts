import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-explorer-component',
  templateUrl: './explorer.component.html'
})
export class ExplorerComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-centered-top') hostClass = true;

  info: any;
  node: any;
  blockchain: any;
  network: any;
  configuration: any;
  consensus: any;
  peers: any;
  blocks: any;
  timerInfo: any;
  timerBlocks: any;
  errorBlocks: string;
  errorInfo: string;
  subscription: any;

  constructor(private api: ApiService, public setup: SetupService) {
    this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
      await this.updateInfo();
      await this.updateBlocks();
    });
  }

  async ngOnInit() {

  }

  ngOnDestroy(): void {
    clearTimeout(this.timerInfo);
    clearTimeout(this.timerBlocks);
    this.subscription.unsubscribe();
  }

  async updateBlocks() {
    try {
      const list = await this.api.getBlocks(0, 5);

      // When the offset is not set (0), we should reverse the order of items.
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

      this.blocks = list;
      this.errorBlocks = null;
    } catch (error) {
      this.errorBlocks = error;
    }

    this.timerBlocks = setTimeout(async () => {
      await this.updateBlocks();
    }, 15000);
  }

  async updateInfo() {
    try {
      this.info = await this.api.getInfo();

      this.node = this.info.node;
      this.blockchain = this.node.blockchain;
      this.network = this.node.network;
      this.configuration = this.info.configuration;
      this.consensus = this.configuration?.consensus;
      this.errorInfo = null;
    } catch (error) {
      this.errorInfo = error;
    }

    this.timerInfo = setTimeout(async () => {
      await this.updateInfo();
    }, 15000);
  }
}

