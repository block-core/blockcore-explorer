import { Component, HostBinding, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ApiComponent } from 'src/app/api/api.component';
import { ApiService, HttpError } from 'src/app/services/api.service';
import { SetupService } from 'src/app/services/setup.service';
import { ScrollEvent } from 'src/app/shared/scroll.directive';

@Component({
   selector: 'angor-project-component',
   templateUrl: './angor-project.component.html'
})
export class AngorProject implements OnInit, OnDestroy {
   @HostBinding('class.content-centered-top') hostClass = true;

   info: any;
   node: any;
   blockchain: any;
   network: any;
   configuration: any;
   consensus: any;
   peers: any;
   blocks: any;
   project: any;
   investments: any

   timerInfo: any;
   timerBlocks: any;
   timerTransactions: any;
   contractType: any;
   balance: any;
   detailsVisible = false;
   lastBlockHeight: number;
   subscription: any;
   limit = 10;
   loading = false;
   count = 0;
   total: any;
   link: string;
   error: any;
   errorTransactions: any;
   navPath: any;

   constructor(
      private api: ApiService,
      private router: Router,
      public setup: SetupService,
      private activatedRoute: ActivatedRoute) {

      this.activatedRoute.paramMap.subscribe(async params => {


         const id: any = params.get('projectid');
         this.project = null;

         try {

            this.navPath = "../../";

            await this.getProject('/api/query/Angor/projects/' + id);

            await this.getInvestments('/api/query/Angor/projects/' + id + '/investments??offset=&limit=' + this.limit);
            
         } catch (err) {
            if (err.message[0] === '{') {
               this.errorTransactions = JSON.parse(err.message);
            } else {
               this.errorTransactions = err;
            }
         }
      });
   }

      async ngOnInit() {

   }

   toggleDetails() {
      this.detailsVisible = !this.detailsVisible;
   }

   ngOnDestroy(): void {

   }

   async getProject(url) {
      // If no URL, then likely reached the end.
      if (!url) {
         return;
      }

      const baseUrl = this.api.baseUrl.replace('/api', '');
      // For the block scrolling (using link http header), we must manually set full URL.
      const response = await this.api.request(baseUrl + url);

      // When the offset is not set (0), we should reverse the order of items.
      const list = await response.json();

      if (response.status !== 200) {
         if (list && list.status) {
            throw new HttpError(list.status, url, JSON.stringify(list));
         } else {
            throw new HttpError(response.status, url, response.statusText);
         }
      }

      this.project = list;
   }

   async getInvestments(url) {
      // If no URL, then likely reached the end.
      if (!url) {
         return;
      }

      const baseUrl = this.api.baseUrl.replace('/api', '');
      // For the block scrolling (using link http header), we must manually set full URL.
      const response = await this.api.request(baseUrl + url);

      // When the offset is not set (0), we should reverse the order of items.
      const list = await response.json();

      if (response.status !== 200) {
         if (list && list.status) {
            throw new HttpError(list.status, url, JSON.stringify(list));
         } else {
            throw new HttpError(response.status, url, response.statusText);
         }
      }

      list.sort((b, a) => {
         if (a.createdOnBlock === b.createdOnBlock) {
            return 0;
         }
         if (a.createdOnBlock < b.createdOnBlock) {
            return -1;
         }
         if (a.createdOnBlock > b.createdOnBlock) {
            return 1;
         }
      });


      this.total = response.headers.get('Pagination-Total');
      const linkHeader = response.headers.get('Link');
      const links = this.api.parseLinkHeader(linkHeader);

      // This will be set to undefined/null when no more next links is available.
      this.link = links['previous'];

      if (!this.investments) {
         this.investments = [];
      }

      this.investments = [...this.investments, ...list];
      this.count++;
   }

   async onScroll(event: ScrollEvent) {
      console.log('scroll occurred', event);

      if (event.isReachingBottom) {
         console.log(`the user is reaching the bottom`);

         this.loading = true;

         setTimeout(async () => {
            await this.getInvestments(this.link);
            this.loading = false;
         });

      }
      if (event.isReachingTop) {
         console.log(`the user is reaching the top`);
      }
      if (event.isWindowEvent) {
         console.log(`This event is fired on Window not on an element.`);
      }
   }
}

