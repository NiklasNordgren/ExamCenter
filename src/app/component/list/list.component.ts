import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private navigatingText = "Abbriviation";
  private data = [{
    name: 'Matematik',
    shortDesc: 'MA'
  },{
    name: 'Datakunskap',
    shortDesc: 'DA'
  }];
  columnsToDisplay = ['shortDesc', 'name'];
  constructor() { }

  ngOnInit() {
  }

}
