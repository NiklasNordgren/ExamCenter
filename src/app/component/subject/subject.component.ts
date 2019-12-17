import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';

@Component({
	selector: 'app-subject',
	templateUrl: './subject.component.html',
	styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {

	subscriptions = new Subscription();
	private shortHeader = 'Code';
	private name = 'Course';
	private data = [];
	private url = '/exams/course/';

	constructor(private route: ActivatedRoute, private service: CourseService) { }

	ngOnInit() {
		this.subscriptions.add(this.route.paramMap.subscribe(params => {
			const subjectId = parseInt(params.get('id'), 10);
			this.setCoursesBySubjectId(subjectId);
		}));
	}
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	setCoursesBySubjectId(subjectId) {
		this.service.getAllCoursesBySubjectId(subjectId).subscribe(courses => {
			this.data = [];
			courses.forEach(course => {
				this.data.push({
					name: course.name,
					shortDesc: course.courseCode,
					id: course.id
				});
			});
		});
	}
}
