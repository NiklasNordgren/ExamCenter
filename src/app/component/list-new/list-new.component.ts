import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: "app-list-new",
  templateUrl: "./list-new.component.html",
  styleUrls: ["./list-new.component.scss"]
})
export class ListNewComponent implements OnInit {
  @Input() data: any[];
  @Input() shortHeader: string;
  @Input() name: string;
  @Output() clicked = new EventEmitter();
  // @Input() url: string;
  private columnsToDisplay;

  constructor(private router: Router) {}

  ngOnInit() {
    this.columnsToDisplay = [this.shortHeader, this.name];
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

  rowClicked(clickedRow) {
    console.log("Row clicked");
    this.clicked.emit(clickedRow);
  }
}
