import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      private http: HttpClient,
   ) {

   }

   async download(url, options = {}) {
      console.log('DOWNLOADING:', url);
      const response = await fetch(url, options);
      const json = await response.json();

      if (response.status !== 200) {
         if (json && json.status) {
            throw new HttpError(json.status, url, json.title);
         } else {
            throw new HttpError(response.status, url, response.statusText);
         }
      }

      console.log('DOWNLOADED:', url);
      return json;
   }

   async downloadRelative(path, options = {}) {
      return this.download(this.baseUrl + path, options);
   }

   async request(url, options = {}) {
      console.log('DOWNLOADING:', url);
      const response = await fetch(url, options);
      return response;
   }

   async requestRelative(path, options = {}) {
      console.log('DOWNLOADING:', this.baseUrl + path);
      const response = await fetch(this.baseUrl + path, options);
      return response;
   }

   async loadSetup(chain: string) {
      const setup = await this.download('https://chains.blockcore.net/chains/' + chain.toUpperCase() + '.json');
      this.baseUrl = setup.Explorer.Indexer.ApiUrl;

      // Remove the trailing / as we expect all URLs we build up expect it.
      if (this.baseUrl.endsWith('/')) {
         this.baseUrl = this.baseUrl.substring(0, this.baseUrl.length - 1);
      }

      this.baseUrl = 'http://localhost:9910/api';

      return setup;
   }

   async loadSetups() {
      return this.download('https://chains.blockcore.net/CHAINS.json');
   }

   async getInfo() {
      return this.downloadRelative('/stats/info');
   }

   async getLastBlock(transactions: boolean = true) {
      return this.downloadRelative('/query/block/latest');
   }

   async getBlocks(offset: number, limit: number) {
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

   parseLinkHeader(linkHeader: string) {
      const sections = linkHeader.split(', ');
      //const links: Record<string, string> = { };
      const links = {first: null, last: null, previous: null, next: null};

      sections.forEach(section => {
         const key = section.substring(section.indexOf('rel="') + 5).replace('"', '');
         const value = section.substring(section.indexOf('<') + 1, section.indexOf('>'));
         links[key] = value;
      });

      return links;
   }
}
