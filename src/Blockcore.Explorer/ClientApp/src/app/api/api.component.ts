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
  inputUrl: any;
  errorMessage: any;

  constructor(
    private route: ActivatedRoute,
     public setup: SetupService,
     private api: ApiService,
     ) {
    this.route.data.subscribe(data => console.log('Data :', data));
    this.inputUrl = setup.Explorer.Indexer.ApiUrl
 
  }

  async save() {
    console.log('api save called');
  }


  async discover() {
    
    if(this.dnsendpoints == null)
    {
      this.dnsendpoints =  await this.api.download('https://chains.blockcore.net/services/BLOCKCORE-DNS.json');
    }
  
    this.endpoints = [];
    let chain = this.setup.current;

    for (let index = 0; index < this.dnsendpoints.length; index++) {
      const element = this.dnsendpoints[index];

      try {
        let res = await this.api.download(element["dns-server"] + "/api/dns/services/symbol/"+ chain.toUpperCase() + "/service/Indexer");
        
        res.Source = element["dns-server"];
        res.Source = res.Source.replace("https://", "")
        this.endpoints.push(res);
     
      } catch (err) {
        if (err.message[0] === '{') {
          this.errorMessage = JSON.parse(err.message);
        } else {
          this.errorMessage = err;
        }
        console.log(err);        
      }
    }
  }


  async savedomain(event, item){
    console.log('api save domain');

    var domain = item.domain;
    domain = "https://" + domain + "/api";   
    this.inputUrl = domain;
  }

  async reset(){
    this.inputUrl = this.setup.Explorer.Indexer.ApiUrl

  }

}
