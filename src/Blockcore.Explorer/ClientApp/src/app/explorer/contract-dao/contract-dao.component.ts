import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SetupService} from "../../services/setup.service";

@Component({
   selector: 'app-contract-dao-component',
   templateUrl: './contract-dao.component.html'
})

export class ContractDaoComponent implements OnInit,OnDestroy{
   daoContract: any;
   error: null;
   totalDepositsAmount:number = 0;
   totalAmountOnApprovedProposals:number = 0;
   deposits: Map<string, any>;
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
            this.daoContract = await this.api.getContractDaoTransaction(address);

            this.totalDepositsAmount = this.daoContract.deposits.map((item)=> Number.parseInt(item.amount)).reduce((acc, curr) => acc + curr, 0);

            this.totalAmountOnApprovedProposals = this.daoContract.proposals.map((item)=> {
               Number.parseInt(item.amount) * (item.wasProposalAccepted ? 1 : -1)
            }).reduce((acc, curr) => acc + curr, 0);

            // this.daoContract.deposits.forEach((item) =>
            // {
            //    if (this.deposits[item.senderAddress] == null)
            //    {
            //       this.deposits[item.senderAddress] = new item()
            //    }
            //
            //    this.deposits[item.senderAddress].amount += item.amount;
            //    this.deposits[item.senderAddress].transactions += 1;
            //
            // })

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
