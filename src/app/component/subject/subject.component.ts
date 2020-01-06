import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Academy } from 'src/app/model/academy.model';

@Component({
	selector: 'app-subject',
	templateUrl: './subject.component.html',
	styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {

	private subscriptions = new Subscription();
	academyName = 'NoName';
	academyName$: Observable<Academy>;
	shortHeader = 'Abbreviation';
	name = 'Subject';
	data = [];
	url = '/courses/subject/';
	academyId = 0;

	constructor(private route: ActivatedRoute, private service: SubjectService, private serviceOver: AcademyService) { }

	ngOnInit() {
		this.subscriptions.add(this.route.paramMap.subscribe(params => {
			this.academyId = parseInt(params.get('id'), 10);
			this.setSubjetsByAcademyId(this.academyId);
			
		}));
		
		//this.getAcademyNameById(this.academyId)		
	}
	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	setSubjetsByAcademyId(academyId) {
		this.getAcademyNameById(academyId);
		this.service.getAllSubjectsByAcademyId(academyId).subscribe(subjects => {
			this.data = [];
			subjects.forEach(subject => {
				this.data.push({
					name: subject.name,
					shortDesc: subject.code,
					id: subject.id
				});
			});
		});
	}

	getAcademyNameById(academyId) {
		console.log("in get academyname metod");

		this.academyName$ = this.serviceOver.getAcademyById(this.academyId);


	/*	this.serviceOver.getAcademyById(this.academyId).subscribe(academy => {
			console.log("Abbr: " + academy.abbreviation)
			this.academyName = academy.abbreviation;
		}); */
	}
}

