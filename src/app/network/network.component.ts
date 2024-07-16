import { Component, Inject, HostBinding, OnInit, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { SetupService } from '../services/setup.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html'
})
export class NetworkComponent implements OnInit, OnDestroy {
  @HostBinding('class.content-centered-top') hostClass = true;

  info: any;
  node: any;
  blockchain: any;
  network: any;
  configuration: any;
  consensus: any;
  peers: any;
  subscription: any;
  subscription2: any;

  constructor(private api: ApiService, private setup: SetupService, private router: Router, private activatedRoute: ActivatedRoute) {

    this.subscription = this.setup.currentChain$.subscribe(async (chain) => {
      await this.update();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<any> {

  }

  async update() {
    this.info = await this.api.getInfo();

    this.node = this.info.node;
    this.blockchain = this.node.blockchain;
    this.network = this.node.network;
    this.configuration = this.info.configuration;
    this.consensus = this.configuration?.consensus;

    this.peers = await this.getPeers();
  }

  async getPeers() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const list = await this.api.getPeers(yesterday);
    const uniqueVersions = [...new Set(list.map(peer => peer.subVer))];

    const peerList = uniqueVersions.map(version => {
      const item = {};
      item['version'] = version;
      item['peers'] = list.filter(y => y.subVer === version);
      return item;
    });

    return peerList;
  }
}
