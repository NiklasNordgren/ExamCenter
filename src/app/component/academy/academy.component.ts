import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit {
  subscriptions = new Subscription();
  private shortHeader = 'Abbrivation';
  private name = 'Academy';
  private data = [{
    name: 'Matematik',
    shortDesc: 'MA'
  },{
    name: 'Datakunskap',
    shortDesc: 'DA'
  }];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      let academyId = parseInt(params.get("id"));
      
    }));
  }

}
