import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SetupService} from "../../services/setup.service";

@Component({
   selector: 'app-dao-contract-component',
   templateUrl: './dao-contract.component.html'
})

export class DaoContractComponent implements OnInit,OnDestroy{
   daoContract: any;
   error: null;
   totalDepositsAmount:number = 0;
   @HostBinding('class.content-centered-top') private _hostClass = true;

   constructor(
      private api: ApiService,
      private router: Router,
      public setup: SetupService,
      private activatedRoute: ActivatedRoute) {

      this.activatedRoute.paramMap.subscribe(async params => {
         const address: any = params.get('address');
         console.log('Smart contract address:', address);

         try {
            this.daoContract = await this.api.getDaoContractTransaction(address);

            this.totalDepositsAmount = this.daoContract.deposits.map((item)=> Number.parseInt(item.amount)).reduce((acc, curr) => acc + curr, 0);

            this.error = null;
         } catch (e) {
            this.error = e;
         }

         console.log(this.daoContract);
      });
   }

   ngOnDestroy(): void {
   }

   ngOnInit(): void {
   }

}
