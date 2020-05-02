import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  @HostBinding('attr.ngNoHost') noHost = '';

  showList: boolean;

  constructor(public setup: SetupService) {

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
