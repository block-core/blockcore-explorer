import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';

@Component({
   selector: 'app-contract-transaction-component',
   templateUrl: './contract-transaction.component.html'
})
export class ContractTransactionComponent implements OnInit, OnDestroy {
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

  constructor(
    private api: ApiService,
    private router: Router,
    public setup: SetupService,
    private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.subscribe(async params => {
      const id: any = params.get('transaction');
      console.log('Transaction ID:', id);

      try {
         this.transaction = await this.api.getContractTransaction(id);
         this.buildLink();

        this.error = null;
      } catch (e) {
        this.error = e;
      }

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

   buildLink() {

      var contractAddress = (this.transaction.newContractAddress) ? this.transaction.newContractAddress : this.transaction.toAddress;

      if (this.transaction.contractCodeType == "DAOContract") {

         this.contractCodeTypeLink = true;
         this.contractCodeTypeLinkPath = "contract-" + this.transaction.contractCodeType.toLowerCase();
         this.contractCodeTypeLinkParam = contractAddress;
      }

      if (this.transaction.contractCodeType == "StandardToken") {

         this.contractCodeTypeLink = true;
         this.contractCodeTypeLinkPath = "contract-" + this.transaction.contractCodeType.toLowerCase();
         this.contractCodeTypeLinkParam = contractAddress;
      }

      if (this.transaction.contractCodeType == "NonFungibleToken") {

         this.contractCodeTypeLink = true;
         this.contractCodeTypeLinkPath = "contract-" + this.transaction.contractCodeType.toLowerCase();
         this.contractCodeTypeLinkParam = contractAddress;
      }

   }
}

