import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {
 
  subscriptions = new Subscription();
  private shortHeader = 'Abbrivation';
  private name = 'Subject';
  private data = [];

  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
}
