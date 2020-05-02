import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html'
})
export class ApiComponent {
  @HostBinding('class.content-centered-top') hostClass = true;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => console.log('Data :', data));
  }
}
