import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

   // Default to bitcoin as that is most user friendly for coins other than Bitcoin.
   format: string = 'bitcoin'; // sat, satcommas, bitcoin

   toggleFormat() {
      if (this.format == 'sat') {
         this.format = 'satcommas';
      } else if (this.format == 'satcommas') {
         this.format = 'bitcoin';
      } else {
         this.format = 'sat';
      }
   }

   // Both SubjectBehavior and Behavior, depending on consumer.
   // The "currentChainSubject$" will return current value as soon as subscribed.
   private readonly currentChainSubjectBehavior = new BehaviorSubject<string>('BLOCKCORE');
   // private readonly currentChainSubject = new Subject<string>();

   // readonly currentChainSubjectBehavior$ = this.currentChainSubjectBehavior.asObservable();
   // readonly currentChainBehavior$ = this.currentChainBehavior.asObservable();
   readonly currentChain$ = this.currentChainSubjectBehavior.asObservable();

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

   async getChains() {

      if (environment.local) {
         return;
      }

      const data = await this.api.loadSetups();
      this.chains = data;
      console.log('CHAINS:', this.chains);
   }

   // Important that this is async and we wait for continued processing,
   // as we must have the chain setup as early as possible.
   async setChain(chain: string) {
      if (chain !== 'BLOCKCORE' && this.current === chain) {
         console.log('CURRENT CHAIN IS SAME!');

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

      console.log(this.Chain);
      console.log(this.Chain.Color);

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
