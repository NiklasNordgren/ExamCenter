import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
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
	@ViewChild(MatSort, {static: true}) sort: MatSort;

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

	sortData(sort: Sort) {
		const data = this.data.slice();
		if (!sort.active || sort.direction === '') {
			this.data = data;
			return;
		}

		this.data = data.sort((a, b) => {			
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return compare(a.name, b.name, isAsc);
				case 'shortDesc': return compare(a.shortDesc, b.shortDesc, isAsc);
				default: return 0;
			}
		});
	} 
}

function compare(a: string, b: string, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
