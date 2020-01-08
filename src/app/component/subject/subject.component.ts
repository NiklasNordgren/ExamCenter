import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { SubjectService } from "src/app/service/subject.service";
import { Navigator } from "src/app/util/navigator";
import {
	IconDefinition,
	faChevronRight
} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-subject",
	templateUrl: "./subject.component.html",
	styleUrls: ["./subject.component.scss"],
	providers: [Navigator]
})
export class SubjectComponent implements OnInit, OnDestroy {
	private subscriptions = new Subscription();
	academyName = 'NoName';
	shortHeader = 'Abbreviation';
	name = 'Subject';
	data = [];
	url = '/courses/subject/';
	academyId = 0;
	icon: IconDefinition = faChevronRight;
	actionDescription: string = "Navigate to selected subject";

	constructor(
		private route: ActivatedRoute,
		private service: SubjectService,
		private router: Router,
		private navigator: Navigator
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				const academyId = parseInt(params.get("id"), 10);
				this.setSubjetsByAcademyId(academyId);
			})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	setSubjetsByAcademyId(academyId) {
		const sub = this.service
			.getAllSubjectsByAcademyId(academyId)
			.subscribe(subjects => {
				this.data = [];
				subjects.forEach(subject => {
					this.data.push({
						name: subject.name,
						shortDesc: subject.code,
						id: subject.id
					});
				});
			});
		this.subscriptions.add(sub);
	}
}
