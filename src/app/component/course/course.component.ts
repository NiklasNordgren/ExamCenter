import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-course',
	templateUrl: './course.component.html',
	styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute) { }

	constructor() { }

	ngOnInit() {

	}
	ngOnDestroy(): void {
		throw new Error('Method not implemented.');
	}

}
