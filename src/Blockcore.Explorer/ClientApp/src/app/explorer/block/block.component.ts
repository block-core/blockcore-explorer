import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';

@Component({
  selector: 'app-block-component',
  templateUrl: './block.component.html'
})
export class BlockComponent implements OnInit, OnDestroy {
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
  block: any;
  detailsVisible = false;
  lastBlockHeight: number;
  subscription: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {
      const id: any = params.get('block');
      // LONG_MAX: 9223372036854775807

      if (id.length < 20) {
        this.block = await this.api.getBlockByHeight(id);
      } else {
        this.block = await this.api.getBlockByHash(id);
      }

      // TODO: When refactoring and implementing better state management,
      // the tip should always be easily accessible, as oppose to doing this:
      const lastBlock = await this.api.getLastBlock(false);
      this.lastBlockHeight = lastBlock.blockIndex;
    });
  }

  async ngOnInit() {

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.key === 'ArrowRight' || event.key === 'PageUp') {
      this.nextBlock();
    }

    if (event.key === 'ArrowLeft' || event.key === 'PageDown') {
      this.previousBlock();
    }

    if (event.key === 'Home') {
      this.navigateToBlock(1);
    }

    if (event.key === 'End') {
      this.lastBlock();
    }
  }

  navigateToBlock(index: number) {
    // TODO: Figure out how we can navigate relative with the router. "relativeTo"?
    this.router.navigate([this.setup.current, 'explorer', 'block', index]);
  }

  previousBlock() {
    if (this.block.blockIndex === 1) {
      return;
    }

    this.navigateToBlock(this.block.blockIndex - 1);
  }

  nextBlock() {
    if (this.block.blockIndex === this.lastBlockHeight) {
      return;
    }

    this.navigateToBlock(this.block.blockIndex + 1);
  }

  lastBlock() {
    this.navigateToBlock(this.lastBlockHeight);
  }

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
  }

  ngOnDestroy(): void {

  }
}

