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

            if (this.transaction.outputs.length == 2) {
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

   /** Parse the hex formatted script. Ref: https://en.bitcoin.it/wiki/Script */
   parseOpreturn(data: any) {
      if (!data) {
         return null;
      }

      // First get the bytes from the complete hex value:
      const buff = this.hexToBytes(data);// secp.utils.hexToBytes(data);

      if (buff[0] != 106) {
         throw new Error('Not OP_RETURN.');
      }

      const opcode = buff[1];

      let skip = 2; // 1-75: The next opcode bytes is data to be pushed onto the stack

      if (opcode == 76) {
         // The next byte contains the number of bytes to be pushed onto the stack.
         skip = 3;
      } else if (opcode == 77) {
         // The next two bytes contain the number of bytes to be pushed onto the stack in little endian order.
         skip = 5;
      } else if (opcode == 78) {
         // The next four bytes contain the number of bytes to be pushed onto the stack in little endian order.
         skip = 6;
      }

      // Skip the prefix for OP_RETURN:
      const parsedBuff = buff.slice(skip, buff.length);

      if (parsedBuff.length == 0) {
         return null;
      }

      // First transform back to hex, but now only the payload data:
      const dataHex = this.bytesToHex(parsedBuff);// secp.utils.bytesToHex(parsedBuff);

      return this.hexToUtf8(dataHex);
   }

   hexToUtf8(hex: any) {
      return decodeURIComponent('%' + hex.match(/.{1,2}/g).join('%'));
   }

   // Convert a hex string to a byte array
   hexToBytes(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
         bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
   }

   // Convert a byte array to a hex string
   bytesToHex(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
         var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
         hex.push((current >>> 4).toString(16));
         hex.push((current & 0xF).toString(16));
      }
      return hex.join("");
   }
}

