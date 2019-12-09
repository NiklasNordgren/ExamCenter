

import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav-horiz',
  templateUrl: './nav-horiz.component.html',
  styleUrls: ['./nav-horiz.component.scss']
})
export class NavHorizComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

}
/*

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

}*/
