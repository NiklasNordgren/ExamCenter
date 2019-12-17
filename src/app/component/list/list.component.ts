import { Component, OnInit, Input } from '@angular/core';
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
  @Input() url: string;
  private columnsToDisplay;

	constructor(private router: Router) {  }

	ngOnInit() {
		this.columnsToDisplay = [this.shortHeader, this.name];
	}

  goToPage(pageName:string){
    console.log(pageName);
    
    this.router.navigate([`${pageName}`]);
  }
}
