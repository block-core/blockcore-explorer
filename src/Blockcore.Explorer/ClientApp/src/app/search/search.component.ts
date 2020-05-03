import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { SetupService } from '../services/setup.service';
import { Router, ActivatedRoute, NavigationEnd, ResolveEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit, OnDestroy {
  // @HostBinding('class.content-centered') hostClass = true;

  searchTerm: any;

  constructor(
    private api: ApiService,
    public setup: SetupService,
    private router: Router) {

  }
  ngOnDestroy(): void {

  }

  async ngOnInit() {

  }

  inputType(value) {
    // LONG_MAX: 9223372036854775807
    if (value.length < 20) {
      return 'index';
    } else if (value.length > 30 && value.length < 54) {
      return 'address';
    } else {
      return 'hash';
    }
  }

  async search() {
    const text = this.searchTerm;
    console.log('search for:' + text);

    const inputType = this.inputType(text);

    switch (inputType) {
      case 'index': {
        // tslint:disable-next-line: radix
        const index = parseInt(text);

        if (index !== NaN && index > 0) {
          this.router.navigate([this.setup.current, 'explorer', 'block', index]);
        }

        break;
      }
      case 'address': {
        this.router.navigate([this.setup.current, 'explorer', 'address', text]);
        break;
      }
      case 'hash': {
        // Search first for block then if not found, search for transaction.
        let block = null;

        // TODO: An important todo is to put the search results from here into state-management!
        //       That way, we will avoid loading the transaction/block twice when searching.

        try {
          block = await this.api.getBlockByHash(text);
        } catch (err) {
          // We could check if this is actually an 404 or some other error. Should we?
        }

        if (block) {
          this.router.navigate([this.setup.current, 'explorer', 'block', block.blockHash]);
        } else {
          const transaction = await this.api.getTransaction(text);
          this.router.navigate([this.setup.current, 'explorer', 'transaction', transaction.transactionId]);
        }

        break;
      }
    }
  }
}
