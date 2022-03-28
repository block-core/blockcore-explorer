import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class HttpError extends Error {
   code: number;
   url: string;

   constructor(code: number, url: string, message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = HttpError.name;
      this.url = url;
      this.code = code;
   }
}

// export class NotFoundError extends HttpError {
//    constructor(message?: string) {
//       super(404, message);
//       Object.setPrototypeOf(this, new.target.prototype);
//       this.name = NotFoundError.name;
//    }
// }

@Injectable({
   providedIn: 'root'
})
export class ApiService {

   setup: any;
   baseUrl: string;

   constructor(
      private http: HttpClient
   ) {

   }

   async download(url, options = {}) {
      const response = await fetch(url, options);
      const json = await response.json();

      if (response.status !== 200) {
         if (json && json.status) {
            throw new HttpError(json.status, url, JSON.stringify(json));
         } else {
            throw new HttpError(response.status, url, response.statusText);
         }
      }

      return json;
   }

   async downloadRelative(path, options = {}) {
      return this.download(this.baseUrl + path, options);
   }

   async request(url, options = {}) {
      const response = await fetch(url, options);
      return response;
   }

   async requestRelative(path, options = {}) {
      const response = await fetch(this.baseUrl + path, options);
      return response;
   }

   async loadSetup(chain: string) {

      console.log('LOAD SETUP', chain);

      let setup = null;

      if (environment.local) {
         setup = await this.download('chain.json');
      } else {
         setup = await this.download('https://chains.blockcore.net/chains/' + chain.toUpperCase() + '.json');
      }

      this.baseUrl = setup.Explorer.Indexer.ApiUrl;

      // Remove the trailing / as we expect all URLs we build up expect it.
      if (this.baseUrl.endsWith('/')) {
         this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
      }

      if (environment.useLocalIndexer) {
         this.baseUrl = 'http://localhost:9910/api';
      }

      return setup;
   }

   async loadSetups(chain: string) {
      return this.download(`https://chains.blockcore.net/CHAINS-${chain}.json`);
   }

   async getInfo() {
      return this.downloadRelative('/stats/info');
   }

   async getLastBlock(transactions: boolean = true) {
      return this.downloadRelative('/query/block/latest');
   }

   async getBlocks(offset: number | string, limit: number) {
      return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit);
   }

   async getBlocksRequest(offset: number, limit: number) {
      return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit);
   }

   async getBlockByHeight(index: number) {
      return this.downloadRelative('/query/block/index/' + index);
   }

   async getBlockByHash(hash: string) {
      return this.downloadRelative('/query/block/' + hash);
   }

   async getTransaction(hash: string) {
      return this.downloadRelative('/query/transaction/' + hash);
   }

   async getAddress(address: string, transactions: boolean = false) {
      const options = transactions ? '/transactions' : '';
      return this.downloadRelative('/query/address/' + address + options);
   }

   async getPeers(date: Date) {
      return this.downloadRelative('/stats/peers/' + date.toISOString());
   }

   async getRichlist(offset: number, limit: number) {
      return this.downloadRelative('/insight/richlist?offset=' + offset + '&limit=' + limit);
   }

   async getSupply() {
      return this.downloadRelative('/insight/supply');
   }

   async getWallets() {
      return this.downloadRelative('/insight/wallets');
   }

   async getContractTransaction(hash: string) {
      return this.downloadRelative('/query/cirrus/contract/transaction/' + hash);
   }

   async getContractAddress(address: string) {
      return this.downloadRelative('/query/cirrus/contract/' + address);
   }

   async getContractCode(address: string) {
      return this.downloadRelative('/query/cirrus/contract/code/' + address);
   }

   async getContractDaoTransaction(address: string) {
      return this.downloadRelative('/query/cirrus/contract/dao/' + address);
   }

   async getContractTokenTransaction(address: string) {
      return this.downloadRelative('/query/cirrus/contract/standardtoken/' + address);
   }

   async getContractList() {
      return this.downloadRelative('/query/cirrus/contract/list/');
   }


   parseLinkHeader(linkHeader: string) {
      const sections = linkHeader.split(', ');
      //const links: Record<string, string> = { };
      const links = { first: null, last: null, previous: null, next: null };

      sections.forEach(section => {
         const key = section.substring(section.indexOf('rel="') + 5).replace('"', '');
         const value = section.substring(section.indexOf('<') + 1, section.indexOf('>'));
         links[key] = value;
      });

      return links;
   }
}
