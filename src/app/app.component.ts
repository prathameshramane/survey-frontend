import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AngularWorkbox';
  posts: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .subscribe((res) => {
        this.posts = res;
      })
  }

  createPost() {
    const data = {
      title: "Hello World!",
      body: "This is the body of the post!"
    };
    this.http
      .post('https://jsonplaceholder.typicode.com/posts', data)
      .subscribe((res) => {
        console.log(res);
      })
  }
}
