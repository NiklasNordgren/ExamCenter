import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	@Input() data: any[];
	@Input() shortHeader: string;
	@Input() name: string;
	@Input() icon: IconDefinition;
	@Input() actionDescription: string;
	@Output() clicked = new EventEmitter();

	columnsToDisplay: string[] = [];

	constructor(private router: Router) {}

	ngOnInit() {
		if (this.shortHeader && this.shortHeader.length > 0) {
			this.columnsToDisplay.push(this.shortHeader);
		}
		this.columnsToDisplay.push(this.name);
	}

	rowClicked(clickedRow) {
		this.clicked.emit(clickedRow);
	}
}
