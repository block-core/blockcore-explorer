import { ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit {
  @HostBinding('attr.ngNoHost') noHost = '';

  showList: boolean;
  chain: any;

  constructor(private setup: SetupService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.setup.currentChain$.subscribe(() => {
      console.log('CURRENT CHAIN CHANGED IN MENU!!', this.setup.current);
      // this.changeDetectorRef.detectChanges();

      if (this.setup.initialized) {
        console.log('INITIALIZED, UPDATE UI!');
        this.chain = this.setup.Chain;
        console.log(this.chain);
      } else {
        console.log('NOT INITIALIZED YET....');
      }

      console.log('WHOPS');
    });
  }

  onMouseOver() {
    this.showList = true;
    return false;
  }

  onMouseOut() {
    this.showList = false;
    return false;
  }


}
