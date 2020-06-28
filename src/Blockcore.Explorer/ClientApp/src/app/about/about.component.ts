import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetupService } from '../services/setup.service';
import { Setup } from '../../../src/setup';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent {
  @HostBinding('class.content-centered') hostClass = true;
  about: any;

  constructor(private setupService: SetupService) {
    this.about = setupService.Explorer.About ?? Setup.About;
  }
}
