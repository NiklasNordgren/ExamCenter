import {
	Component,
	OnDestroy,
	OnInit,
	ChangeDetectorRef,
} from '@angular/core';
import { SearchService } from 'src/app/service/search.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Subject } from 'src/app/model/subject.model';
import { Course } from 'src/app/model/course.model';
import { Navigator } from 'src/app/util/navigator';
import {
	trigger,
	state,
	style,
	transition,
	animate
} from '@angular/animations';
import {
	IconDefinition,
	faChevronRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss'],
	providers: [Navigator],
	animations: [
		trigger('toggle', [
			state('closed', style({ height: '0px', minHeight: '0' })),
			state('open', style({ height: '*' })),
			transition(
				'closed <=> open',
				animate('225ms cubic-bezier(0.0, 0.0, 0.2, 1)')
			)
		])
	]
})
export class SearchResultComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	searchString: string;
	subjectData = [];
	courseData = [];
	showSubjects = false;
	showCourses = false;
	subjectsLoaded = false;
	coursesLoaded = false;
	faChevronRight: IconDefinition = faChevronRight;

	constructor(
		private searchService: SearchService,
		private activatedRoute: ActivatedRoute,
		private navigator: Navigator,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
		const sub = this.activatedRoute.params.subscribe(params => {
			this.searchString = params.searchString;
			this.search(this.searchString);
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	search(searchText: string) {
		this.subscriptions.add(
			this.searchService.searchSubjects(this.searchString).subscribe(subjects => {
				subjects.forEach(subject => {
					this.subjectData.push({
						name: subject.name,
						shortDesc: subject.code,
						id: subject.id
					});
				});
				this.subjectsLoaded = true;
			})
		);
		this.subscriptions.add(
			this.searchService.searchCourses(this.searchString).subscribe(courses => {
				courses.forEach(course => {
					this.courseData.push({
						name: course.name,
						shortDesc: course.courseCode,
						id: course.id
					});
				});
				this.coursesLoaded = true;
			})
		);
	}

	subjectSelected(subjectId: number) {
		this.navigator.goToPage('/courses/subject/' + subjectId);
	}

	courseSelected(courseId: number) {
		this.navigator.goToPage('/exams/course/' + courseId);
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
