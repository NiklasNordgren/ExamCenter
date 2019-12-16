import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-subject',
	templateUrl: './subject.component.html',
	styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {

	subscriptions = new Subscription();
	private shortHeader = 'Abbrivation';
	private name = 'Subject';
	private data = [];

	constructor(private route: ActivatedRoute, private service: CourseService) { }

	ngOnInit() {
		this.subscriptions.add(this.route.paramMap.subscribe(params => {
			const subjectId = parseInt(params.get('id'), 10);

			this.setCoursesBySubjectId(subjectId);
		}));
	}
	ngOnDestroy(): void {
		throw new Error('Method not implemented.');
	}

	setCoursesBySubjectId(subjectId) {
		this.service.getAllCoursesBySubjectId(subjectId).subscribe(courses => {
			this.data = [];
			courses.forEach(course => {
				this.data.push({
					name: course.name,
					code: course.code,
					id: course.id
				});
			});
		});
	}
}
