import {
	Component,
	OnDestroy,
	ViewChild,
	ElementRef,
	Renderer2,
	OnInit,
	ChangeDetectorRef,
	AfterViewInit
} from "@angular/core";
import { SearchService } from "src/app/service/search.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { Subject } from "src/app/model/subject.model";
import { Course } from "src/app/model/course.model";
import { Navigator } from "src/app/util/navigator";
import {
	trigger,
	state,
	style,
	transition,
	animate,
	stagger,
	query
} from "@angular/animations";
import { MatPaginator } from "@angular/material";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.scss"],
	providers: [Navigator],
	animations: [
		trigger("toggle", [
			state("closed", style({ height: "0px", minHeight: "0" })),
			state("open", style({ height: "*" })),
			transition(
				"closed <=> open",
				animate("225ms cubic-bezier(0.0, 0.0, 0.2, 1)")
			)
		])
	]
})
export class SearchResultComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	searchString: string;
	subjects: Observable<Subject[]>;
	courses: Observable<Course[]>;
	showSubjects: boolean = false;
	showCourses: boolean = false;
	subjectsLoaded: boolean = false;
	coursesLoaded: boolean = false;

	constructor(
		private searchService: SearchService,
		private activatedRoute: ActivatedRoute,
		private navigator: Navigator,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
		const sub = this.activatedRoute.params.subscribe(params => {
			this.searchString = params["searchString"];
			this.search(this.searchString);
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	search(searchText: string) {
		this.subscriptions.add(
			this.searchService
				.searchForSubjectsAndCourses(searchText)
				.subscribe(result => {
					this.subjects = result[0];
					this.subjectsLoaded = true;
					this.courses = result[1];
					this.coursesLoaded = true;
					this.changeDetector.detectChanges();
				})
		);
	}

	subjectSelected(subjectId: number) {
		this.navigator.goToPage("/courses/subject/" + subjectId);
	}

	courseSelected(courseId: number) {
		this.navigator.goToPage("/exams/course/" + courseId);
	}

	toggleSubjectTable() {
		if (this.showSubjects) {
			this.showSubjects = false;
			this.changeDetector.detectChanges();
		} else {
			this.showSubjects = true;
			this.changeDetector.detectChanges();
		}
	}

	toggleCourseTable() {
		if (this.showCourses) {
			this.showCourses = false;
			this.changeDetector.detectChanges();
		} else {
			this.showCourses = true;
			this.changeDetector.detectChanges();
		}
	}
}
