import { Component, HostBinding } from '@angular/core';
import { SetupService } from '../services/setup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @HostBinding('class.content-centered') hostClass = true;

  constructor(public setup: SetupService) {

  }
}
