import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubjectService } from 'src/app/service/subject.service';
import { Subject } from 'src/app/model/subject.model';

@Component({
	selector: 'app-academy',
	templateUrl: './academy.component.html',
	styleUrls: ['./academy.component.scss']
})
export class AcademyComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  private shortHeader = 'Abbrivation';
  private name = 'Subject';
  private data = [];
  private selectedSubject: Subject;
  private url = "/courses/subject/";

	constructor(private route: ActivatedRoute, private service: SubjectService) { }

	ngOnInit() {
		this.subscriptions.add(this.route.paramMap.subscribe(params => {
			const academyId = parseInt(params.get('id'), 10);

			this.setSubjetsByAcademyId(academyId);

		}));
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSelect(subject: Subject): void {
		this.selectedSubject = subject;
	}
	setSubjetsByAcademyId(academyId) {
		this.service.getAllSubjectsByAcademyId(academyId).subscribe(subjects => {
			this.data = [];
			subjects.forEach(subject => {
				this.data.push({
          name: subject["name"],
          shortDesc: subject["code"],
          id: subject["id"]
        });
			});
		});
	}
}
