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

      // When resolving the route, just get the latest always (defaults to 'BLOCKCORE').
      let explorerChain = this.setup.current;
      let wasInitilized = this.setup.initialized;

      // If not initialized yet, perform some operations:
      if (!this.setup.initialized) {
         console.log('Initilization of Explorer');

         try {
            // First make a request to the local API to check what chain instance it is runnign.
            const explorerChainRequest = await this.api.request('/api/explorer/chain');

            if (explorerChainRequest.status === 200) {
               explorerChain = await explorerChainRequest.text();

               console.log('API Chain:', explorerChain);
               this.setup.apiChain = explorerChain;

               this.setup.multiChain = (explorerChain === 'BLOCKCORE' || explorerChain === 'COINVAULT');
            } else { // If it fails... fallback
               this.setup.multiChain = true;
               this.setup.apiChain = 'BLOCKCORE';
            }
         } catch {
            this.setup.multiChain = true;
            this.setup.apiChain = 'BLOCKCORE';
         }

         if (this.setup.multiChain) {
            console.log('GO GET', explorerChain);
            await this.setup.getChains(explorerChain);
         }

         // If local is set to true, then we'll default to single chain and also not run normal initialization where the API is queried.
         if (environment.local) {
            this.setup.multiChain = false;
            this.setup.initialized = true;
            explorerChain = 'local'; // Used in the URLs, so make sure it is lowercase.
         }

         this.setup.initialized = true;
      }

      console.log('Explorer Chain:', explorerChain);

      // TODO: Figure out a better way to get path fragments pre-parsed into an array.
      const fragments = state.url.split('/');
      let chain = fragments[1];

      if (chain != '') {
         return this.setup.setChain(chain);
      } else {
         // We should reset to multichain configuration if user navigate back to home.
         // If already initilized and no chain in URL; we'll reset back to root.
         if (wasInitilized) {
            return this.setup.setChain(this.setup.apiChain);
         } else {
            return this.setup.setChain(explorerChain);
         }
      }
   }
}
