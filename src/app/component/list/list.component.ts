import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	@Input() data: any[];
	@Input() shortHeader: string;
	@Input() name: string;
	@Output() clicked = new EventEmitter();

	private columnsToDisplay;

	constructor(private router: Router) {}

	ngOnInit() {
		this.columnsToDisplay = [this.shortHeader, this.name];
	}

	rowClicked(clickedRow) {
		console.log('Row clicked');
		console.log(clickedRow);
		this.clicked.emit(clickedRow);
	}
}
