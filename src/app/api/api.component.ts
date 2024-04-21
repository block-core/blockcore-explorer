import { Component, Inject, HostBinding } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { SetupService } from "../services/setup.service";
import { ApiService } from "../services/api.service";
import { BlockcoreDns } from "@blockcore/dns";
import { IndexerProvider } from "@blockcore/provider";

@Component({
   selector: "app-api",
   templateUrl: "./api.component.html",
})
export class ApiComponent {
   @HostBinding("class.content-centered-top") hostClass = true;

   indexers: any;
   dnsendpoints: any;
   inputUrl: any;
   docUrl: any;
   errorMessage: any;
   dns: BlockcoreDns;
   indexerProvider: IndexerProvider;

   constructor(
      private route: ActivatedRoute,
      public setup: SetupService,
      private api: ApiService
   ) {
      this.route.data.subscribe((data) => console.log("Data :", data));

      this.load();
   }

   async load() {
      this.inputUrl = await this.api.getBaseUrl();

      if (this.inputUrl == this.setup.Explorer.Indexer.ApiUrl) {
         this.docUrl = this.setup.Explorer.Indexer.DocUrl;
      } else {
         this.docUrl = this.inputUrl.replace("api", "docs");
      }
   }

   async save() {
      await this.api.setBaseUrl(this.setup.current, this.inputUrl);
      await this.load();
   }

   async discover() {
      try {
         let chain = this.setup.current;

         this.dns = new BlockcoreDns();
         await this.dns.load();

         this.indexers = this.dns.getOnlineServicesByNetwork(
            chain.toUpperCase()
         );
      } catch (err) {
         if (err.message[0] === "{") {
            this.errorMessage = JSON.parse(err.message);
         } else {
            this.errorMessage = err;
         }
         console.log(err);
      }
   }

   async saveDomain(item) {
      var domain = item.domain;
      domain = "https://" + domain + "/api";
      this.inputUrl = domain;
      await this.save();
   }

   async reset() {
      await this.api.resetBaseUrl(this.setup.current);
      await this.load();
   }
}
