import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
      try {
         console.log('DOWNLOADING:', url);
         const response = await fetch(url, options);
         const setup = await response.json();
         console.log('DOWNLOADED:', url);
         return setup;
      } catch (error) {
         console.error(error);
      }
   }

   async downloadRelative(path, options = {}) {
      try {
         console.log('DOWNLOADING:', this.baseUrl + path);
         const response = await fetch(this.baseUrl + path, options);
         const setup = await response.json();
         console.log('DOWNLOADED:', this.baseUrl + path);
         return setup;
      } catch (error) {
         console.error(error);
      }
   }

   async request(url, options = {}) {
      try {
         console.log('DOWNLOADING:', url);
         const response = await fetch(url, options);
         return response;
      } catch (error) {
         console.error(error);
      }
   }

   async requestRelative(path, options = {}) {
      try {
         console.log('DOWNLOADING:', this.baseUrl + path);
         const response = await fetch(this.baseUrl + path, options);
         return response;
      } catch (error) {
         console.error(error);
      }
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
      return this.download('https://chains.blockcore.net/chains/CHAINS.json');
   }

   async getInfo() {
      return this.downloadRelative('/stats/info');
   }

   async getLastBlock(transactions: boolean = true) {
      return this.downloadRelative('/query/block/latest?transactions=' + transactions);
   }

   async getBlocks(offset: number, limit: number, transactions: boolean = true) {
      return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit + '&transactions=' + transactions);
   }

   async getBlocksRequest(offset: number, limit: number, transactions: boolean = true) {
      return this.downloadRelative('/query/block?offset=' + offset + '&limit=' + limit + '&transactions=' + transactions);
   }

   async getBlockByHeight(index: number, transactions: boolean = true) {
      return this.downloadRelative('/query/block/index/' + index + '?transactions=' + transactions);
   }

   async getBlockByHash(hash: string, transactions: boolean = true) {
      return this.downloadRelative('/query/block/' + hash + '?transactions=' + transactions);
   }

   async getTransaction(hash: string) {
      return this.downloadRelative('/query/transaction/' + hash);
   }

   async getPeers(date: Date) {
      return this.downloadRelative('/stats/peers/' + date.toISOString());
   }
}
