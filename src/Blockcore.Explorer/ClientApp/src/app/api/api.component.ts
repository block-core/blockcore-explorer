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
  docUrl: any;
  errorMessage: any;

  constructor(
    private route: ActivatedRoute,
     public setup: SetupService,
     private api: ApiService,
     ) {
    this.route.data.subscribe(data => console.log('Data :', data));

    this.load();
  }

  async load(){
    this.inputUrl = await this.api.getBaseUrl();

    if(this.inputUrl == this.setup.Explorer.Indexer.ApiUrl){
      this.docUrl =  this.setup.Explorer.Indexer.DocUrl;
    }
    else {
      this.docUrl =  this.inputUrl.replace("api","docs");
    }
  }

  async save() {
    await this.api.setBaseUrl(this.setup.current, this.inputUrl );
    await this.load();
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
    var domain = item.domain;
    domain = "https://" + domain + "/api";   
    this.inputUrl = domain;
    await this.save();
  }

  async reset(){
    await this.api.resetBaseUrl(this.setup.current);
    await this.load();
  }

}
