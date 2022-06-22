import { Component, Inject, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SetupService } from '../services/setup.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html'
})
export class ApiComponent {
  @HostBinding('class.content-centered-top') hostClass = true;


  endpoints: any;
  dnsendpoints: any;

  constructor(
    private route: ActivatedRoute,
     public setup: SetupService,
     private api: ApiService,
     ) {
    this.route.data.subscribe(data => console.log('Data :', data));

 
  }

  async save() {
    console.log('appi csave alled');
  }


  async discover() {
    
    if(this.dnsendpoints == null)
    {
      this.dnsendpoints =  await this.api.download('https://chains.blockcore.net/services/BLOCKCORE-DNS.json');
    }
  
    console.log(this.dnsendpoints);


    this.endpoints = [];
    let chain = this.setup.current;

    for (let index = 0; index < this.dnsendpoints.length; index++) {
      const element = this.dnsendpoints[index];
      let res = await this.api.download(element["dns-server"] + "/api/dns/services/symbol/"+ chain.toUpperCase() + "/service/Indexer");
      console.log(res);
    }

  }


}
