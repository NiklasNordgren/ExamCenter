import { Component, OnInit } from '@angular/core';
import { faUserPlus, faUsersCog, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	constructor() { }

	ngOnInit() {
	}

}
