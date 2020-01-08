import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CourseService } from "src/app/service/course.service";
import { Navigator } from "src/app/util/navigator";
import {
	IconDefinition,
	faChevronRight
} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-course",
	templateUrl: "./course.component.html",
	styleUrls: ["./course.component.scss"],
	providers: [Navigator]
})
export class CourseComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	shortHeader: string = "Code";
	name: string = "Course";
	data = [];
	url: string = "/exams/course/";
	icon: IconDefinition = faChevronRight;
	actionDescription: string = "Navigate to selected course";

	constructor(
		private route: ActivatedRoute,
		private service: CourseService,
		private navigator: Navigator
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				const subjectId = parseInt(params.get("id"), 10);
				this.setCoursesBySubjectId(subjectId);
			})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	setCoursesBySubjectId(subjectId) {
		const sub = this.service
			.getAllCoursesBySubjectId(subjectId)
			.subscribe(courses => {
				this.data = [];
				courses.forEach(course => {
					this.data.push({
						name: course.name,
						shortDesc: course.courseCode,
						id: course.id
					});
				});
			});
		this.subscriptions.add(sub);
	}
}
