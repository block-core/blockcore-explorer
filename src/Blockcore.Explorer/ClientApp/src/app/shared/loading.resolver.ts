import { Injectable } from '@angular/core';
import {
   Resolve,
   ActivatedRouteSnapshot,
   RouterStateSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap, catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';
@Injectable({
   providedIn: 'root'
})
export class LoadingResolverService implements Resolve<any> {
   constructor(
      private api: ApiService,
      private setup: SetupService
   ) { }
   async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Observable<any> | Observable<never>> {

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
   }
}
