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
        this.transaction = await this.api.getTransaction(id);

         if (this.transaction.outputs.length = 2)
         {
            if (this.transaction.outputs[0].outputType == "OP_CALLCONTRACT")
               this.transaction.hasContract = true;

            if (this.transaction.outputs[0].outputType == "OP_CREATECONTRACT")
               this.transaction.hasContract = true;

            if (this.transaction.outputs[1].outputType == "OP_CALLCONTRACT")
               this.transaction.hasContract = true;

            if (this.transaction.outputs[1].outputType == "OP_CREATECONTRACT")
               this.transaction.hasContract = true;
         }

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
}

