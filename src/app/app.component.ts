import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { openDB, IDBPDatabase,  } from "idb";

import constants from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularWorkbox';
  surveys: any;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  subscriptions: Subscription[] = [];
  connectionStatus: string = navigator.onLine ? 'online':'offline';
  pendingRequests: number = 0;
  db: IDBPDatabase;

  surveysUrl: string = `${constants.BACKEND_URL}/surveys/`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.connectionStatus = 'online';
      this.getPendingRequest();
      console.log('Online...');
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.connectionStatus = 'offline';
      this.getPendingRequest();
      console.log('Offline...');
    }));

    this.getSurveys();
    this.initDbConnection();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getSurveys() {
    this.http
      .get(this.surveysUrl)
      .subscribe((res: any) => {
        this.surveys = res;
      });
  }

  createSurvey(data:any, f:any) {
   console.log(data);
   this.http
    .post(this.surveysUrl, data)
    .subscribe(res => {
      console.log(res)
    })
    data.time = new Date();
    this.surveys.unshift  (data);
    f.reset();
  }

  async initDbConnection(){
    this.db = await openDB('workbox-background-sync');
    this.getPendingRequest();
  }

  async getPendingRequest() {
  console.log("Updating Pending Requests....")
   this.pendingRequests = (await this.db.getAllKeysFromIndex('requests','queueName')).length;
  }

  getBlobData() {
    this.http
      .get('https://qtsstorage.blob.core.windows.net/questionnaires/first.json')
      .subscribe((res) => {
        console.log(res);
      })
  }
}
