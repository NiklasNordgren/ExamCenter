import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'; 



@Component({
  selector: 'app-nav-horiz',
  templateUrl: './nav-horiz.component.html',
  styleUrls: ['./nav-horiz.component.scss']
})
export class NavHorizComponent implements OnInit {
  private academies = ["ATM", "AHA", "AUE"];

  constructor() { }

  ngOnInit() {
  }

}
