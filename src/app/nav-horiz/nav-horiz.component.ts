
import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
	selector: 'app-nav-horiz',
	templateUrl: './nav-horiz.component.html',
	styleUrls: ['./nav-horiz.component.scss']
})
export class NavHorizComponent implements OnInit {
	
  //private academies = ["ATM", "AHA", "AUE"];

	constructor(private breakpointObserver: BreakpointObserver) { }
	private academies = ['ATM', 'AHA', 'AUE'];
	ngOnInit(): void {
	}

}
