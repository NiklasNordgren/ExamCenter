import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  @Input() data: any[];
  @Input() shortHeader: string;
  @Input() name: string;
  private columnsToDisplay;

  constructor() {  }

  ngOnInit() {
    this.columnsToDisplay = [this.shortHeader, this.name];
  }

}
