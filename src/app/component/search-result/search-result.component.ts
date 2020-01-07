import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { SearchService } from "src/app/service/search.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { Subject } from "src/app/model/subject.model";
import { Course } from "src/app/model/course.model";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent implements OnInit, OnDestroy, OnChanges {
	subscriptions: Subscription = new Subscription();
	searchString: string;
	subjects: Observable<Subject[]>;
	courses: Observable<Course[]>;
	subjectArray: Subject[];
	courseArray: Course[];

	constructor(
		private searchService: SearchService,
		private activatedRoute: ActivatedRoute
	) {
		this.activatedRoute.params.subscribe(params => {
			this.searchString = params["searchString"];
			this.search(this.searchString);
		});
	}

	ngOnChanges() {}

	ngOnInit() {}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	search(searchText: string) {
		this.subscriptions.add(
			this.searchService.searchForSubjectsAndCourses(searchText).subscribe(
				result => {
					console.log(JSON.stringify(result));

					this.subjects = result[0];
					this.courses = result[1];
				},
				() => {
					this.subscriptions.add(
						this.subjects.subscribe(subjects => {
							this.subjectArray = subjects;
						})
					);
					this.subscriptions.add(
						this.courses.subscribe(courses => {
							this.courseArray = courses;
						})
					);
				}
			)
		);
	}
}