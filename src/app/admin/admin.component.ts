import { Component, OnInit } from '@angular/core';
import { faUserPlus, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  faUserPlus = faUserPlus;
  faCog = faCog;
  faSearch = faSearch;

  constructor() { }

  ngOnInit() {
  }

}
