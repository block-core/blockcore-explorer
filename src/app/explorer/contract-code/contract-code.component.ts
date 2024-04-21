import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService, HttpError } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';
import { ScrollEvent } from 'src/app/shared/scroll.directive';

@Component({
   selector: 'app-contract-code-component',
   templateUrl: './contract-code.component.html'
})
export class ContractCodeComponent implements OnInit, OnDestroy {
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
   transaction: any;

   timerInfo: any;
   timerBlocks: any;
   timerTransactions: any;
   address: any;
   balance: any;
   detailsVisible = false;
   lastBlockHeight: number;
   subscription: any;
   limit = 10;
   loading = false;
   count = 0;
   total: any;
   link: string;
   error: any;
   errorTransactions: any;

   constructor(
      private api: ApiService,
      private router: Router,
      public setup: SetupService,
      private activatedRoute: ActivatedRoute) {

      this.activatedRoute.paramMap.subscribe(async params => {
         const id: any = params.get('address');
         console.log('Address:', id);

         this.transactions = null;
         this.address = id;

         try {
            this.transaction = await this.api.getContractCode(id);
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

   toggleDetails() {
      this.detailsVisible = !this.detailsVisible;
   }

   ngOnDestroy(): void {

   }


}

