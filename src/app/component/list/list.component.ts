import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	@Input() data: any[];
	@Input() shortHeader: string = "";
	@Input() name: string;
	@Input() icon: IconDefinition;
	@Input() actionDescription: string;
	@Output() clicked = new EventEmitter();
	@ViewChild(MatTable, { static: false }) table: MatTable<any>;

	columnsToDisplay: string[] = [];

	constructor(private router: Router) { }

	ngOnInit() {
		if (this.shortHeader && this.shortHeader.length > 0) {
			this.columnsToDisplay.push(this.shortHeader);
		}
		this.columnsToDisplay.push(this.name);

	}

	rowClicked(clickedRow) {
		this.clicked.emit(clickedRow);
	}

	sortByName() {
		this.data.sort((a, b) => {
			if (a.name > b.name) {
				return 1;
			}
			if (a.name < b.name) {
				return -1;
			}
			return 0;
		});
		this.table.renderRows();
	}

	sortByDescription() {
		this.data.sort((a, b) => {
			if (a.shortDesc > b.shortDesc) {
				return 1;
			}
			if (a.shortDesc < b.shortDesc) {
				return -1;
			}
			return 0;
		});
		this.table.renderRows();
	}
}
