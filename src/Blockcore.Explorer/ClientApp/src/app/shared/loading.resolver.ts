import { Injectable } from '@angular/core';
import {
   Resolve,
   ActivatedRouteSnapshot,
   RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root'
})
export class LoadingResolverService implements Resolve<any> {
   constructor(
      private api: ApiService,
      private setup: SetupService
   ) { }
   async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Observable<never>> {

      let explorerChain = this.setup.current;
      this.setup.multiChain = true;

      // If local is set to true, then we'll default to single chain and also not run normal initialization where the API is queried.
      if (environment.local) {
         this.setup.multiChain = false;
         this.setup.initialized = true;
         explorerChain = 'local'; // Used in the URLs, so make sure it is lowercase.
      }

      if (!this.setup.initialized) {
         try {
            this.setup.initialized = true;

            // Fetch the configure explorer chain to see if we should run in single or multi-chain mode.
            const explorerChainRequest = await this.api.request('/api/explorer/chain');

            if (explorerChainRequest.status === 200) {
               explorerChain = await explorerChainRequest.text();
               this.setup.multiChain = (explorerChain === 'BLOCKCORE');
            }

         } catch {
         }
      }

      if (this.setup.multiChain) {
         // TODO: Figure out a better way to get path fragments pre-parsed into an array.
         const fragments = state.url.split('/');
         let chain = fragments[1];

         if (!chain) {
            chain = 'BLOCKCORE';
         }

         // If the chain has changed, load again.
         if (chain === 'BLOCKCORE' || this.setup.current !== chain) {
            return this.setup.setChain(chain);
         }
      } else {
         // If the chain has changed, load again.
         if (this.setup.current !== explorerChain) {
            return this.setup.setChain(explorerChain);
         }
      }
   }
}
