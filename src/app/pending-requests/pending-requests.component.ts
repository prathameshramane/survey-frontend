import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getPendingRequests();
  }

  getPendingRequests() {
    self.addEventListener('sync', this.getSyncInformation)
  }

  async getSyncInformation(event) {
    // const tags = await self.registration.sync.getTags();
    // if (tags.length === 0) {
    //   // There are no registered tags.
    // }
  }
}
