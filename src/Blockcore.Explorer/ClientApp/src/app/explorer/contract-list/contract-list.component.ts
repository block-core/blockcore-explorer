import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';

@Component({
   selector: 'app-contract-list-component',
   templateUrl: './contract-list.component.html'
})
export class ContractListComponent implements OnInit, OnDestroy {
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

  contractCodeTypeLink = false;
  contractCodeTypeLinkPath: any;
  contractCodeTypeLinkParam: any;

   timerInfo: any;
  timerBlocks: any;
  timerTransactions: any;
  transaction: any;
  detailsVisible = false;
  lastBlockHeight: number;
  subscription: any;
  error: Error;
   navPath: any;
   total: any;

  constructor(
    private api: ApiService,
    private router: Router,
    public setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {

      try {
         this.transactions = await this.api.getContractList();
         this.navPath = "../";
         this.total = this.transactions.length;

        this.error = null;
      } catch (e) {
        this.error = e;
      }

       console.log(this.transactions);
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

