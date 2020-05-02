import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';

@Component({
  selector: 'app-transaction-component',
  templateUrl: './transaction.component.html'
})
export class TransactionComponent implements OnInit, OnDestroy {
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
  transaction: any;
  detailsVisible = false;
  lastBlockHeight: number;
  subscription: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {
      const id: any = params.get('transaction');
      console.log('Transaction ID:', id);

      this.transaction = await this.api.getTransaction(id);
      console.log(this.transaction);
    });
  }

  async ngOnInit() {

  }

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
  }

  ngOnDestroy(): void {

  }
}

