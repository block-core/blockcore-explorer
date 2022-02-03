import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as satcomma from 'satcomma';

@Injectable({
   providedIn: 'root'
})
export class SetupService {
   data: any;
   chains: any;

   Chain: any;
   Network: any;
   Indexer: any;
   Explorer: any;

   multiChain: boolean;
   initialized = false;

   private readonly currentChainSubjectBehavior = new BehaviorSubject<string>('BLOCKCORE');
   readonly currentChain$ = this.currentChainSubjectBehavior.asObservable();

   // Default to bitcoin as that is most user friendly for coins other than Bitcoin.
   format: string = 'bitcoin'; // sat, satcommas, bitcoin

   apiChain: string;

   get isCurrentRootChain(): boolean {
      return this.current == 'BLOCKCORE' || this.current == 'COINVAULT';
   }

   toggleFormat() {
      if (this.format == 'sat') {
         this.format = 'satcommas';
      } else if (this.format == 'satcommas') {
         this.format = 'bitcoin';
      } else {
         this.format = 'sat';
      }
   }

   transformFormat(value: number) {
      if (this.format == 'sat') {
         return value.toString();
      }
      else if (this.format == 'bitcoin') {
         return (value / 100000000).toFixed(8);
      }
      else {
         const formatted = satcomma.fromSats(value, { validateBitcoinMaxSupply: false });
         const values = formatted.split('.');
         return (+values[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }) + '.' + values[1];
      }
   }

   get current(): string {
      return this.currentChainSubjectBehavior.getValue();
   }

   set current(val: string) {
      this.currentChainSubjectBehavior.next(val);
   }

   constructor(
      private http: HttpClient,
      private api: ApiService,
      private router: Router
   ) {

   }

   async getChains(chain: string) {
      if (environment.local) {
         console.log(`Environment is local, don't get setup configuration from server.`);
         return;
      }

      const data = await this.api.loadSetups(chain);
      this.chains = data;
   }

   // Important that this is async and we wait for continued processing,
   // as we must have the chain setup as early as possible.
   async setChain(chain: string) {
      if (this.current === chain) {
         // Update the chain subject, which should trigger consumers to do some processing.
         this.current = chain;
         return;
      }

      // Make sure we have downloaded the setup before we trigger change.
      const data = await this.api.loadSetup(chain);

      this.data = data;
      this.Chain = this.data.Chain;
      this.Network = this.data.Network;
      this.Indexer = this.data.Indexer;
      this.Explorer = this.data.Explorer;

      // Update the chain subject, which should trigger consumers to do some processing.
      this.current = chain;

      if (this.Chain?.Color) {
         document.documentElement.style.setProperty('--accent', this.Chain?.Color);
      }

      return null;
   }

   featureEnabled(feature) {
      // If feature is something and it is explicit set to false, hide.
      if (feature === false) {
         return false;
      } else {
         return true;
      }
   }
}
