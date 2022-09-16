import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { openDB, IDBPDatabase,  } from "idb";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularWorkbox';
  posts: any;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;

  subscriptions: Subscription[] = [];
  connectionStatus: string = navigator.onLine ? 'online':'offline';
  pendingRequests: number = 0;
  db: IDBPDatabase;

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

    this.getPosts();
    this.initDbConnection();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getPosts() {
    this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((res: any) => {
        this.posts = res;
      });
  }

  createPost() {
    const data = {
      title: 'Hello World!',
      body: 'This is the body of the post!',
    };
    this.http
      .post('https://jsonplaceholder.typicode.com/posts', data)
      .subscribe({
        next:(res) => {
          console.log(res);
        },
        error: () => {
          this.getPendingRequest();
        }
      })
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
