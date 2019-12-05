import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit {

  private shortHeader = 'Abbrivation';
  private name = 'Academy';
  private data = [{
    name: 'Matematik',
    shortDesc: 'MA'
  },{
    name: 'Datakunskap',
    shortDesc: 'DA'
  }];

  constructor() { }

  ngOnInit() {
  }

}
