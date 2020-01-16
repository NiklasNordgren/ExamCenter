import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Academy } from 'src/app/model/academy.model';
import { MatTableDataSource } from '@angular/material';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Navigator } from 'src/app/util/navigator';

@Component({
	selector: 'app-subject-form',
	templateUrl: './subject-form.component.html',
	styleUrls: ['./subject-form.component.scss'],
	providers: [Navigator]
})
export class SubjectFormComponent implements OnInit, OnDestroy {

	academies: Academy[];
	subjects: Subject[];
	subject: Subject = new Subject();
	form: FormGroup;
	subscriptions = new Subscription();
	id: number;
	dataSource = [];
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;

	constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
		private subjectService: SubjectService, private academyService: AcademyService,
		private navigator: Navigator) { }

	ngOnInit() {
		//If id = 0, it specifies a new subject.
		this.form = this.formBuilder.group({
			academy: '',
			code: '',
			name: ''
		});
		//If id != 0, it specifies editing a subject. Here's how we find the subject in question.
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.handleId();
			})
		);

		//Get all the academies for the dropdownlist of academies. When creating a new subject.
		this.academyService.getAllAcademies().subscribe(responseAcademies => {
			this.academies = responseAcademies;
		});
		this.dataSource = this.subjects;
	}
	handleId() {
		if (this.id !== 0) {
			const sub = this.subjectService.getSubjectById(this.id).subscribe(subject => {
				this.subject.id = subject.id;
				this.subject.unpublished = subject.unpublished;
				this.form = this.formBuilder.group({
					academy: subject.academyId,
					code: subject.code,
					name: subject.name
				});
			});
			this.subscriptions.add(sub);
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			if (this.id !== 0) { this.subject.id = this.id; }
			this.subject.name = this.form.controls.name.value;
			this.subject.code = this.form.controls.code.value;
			this.subject.academyId = this.form.controls.academy.value;
			const sub = this.subjectService.saveSubject(this.subject).subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
			this.subscriptions.add(sub);
			this.form.reset();
		}
	}
	selectedAcademy(academyId: number) {
		const sub = this.subjectService
			.getAllSubjectsByAcademyId(academyId)
			.subscribe(responseSubjects => {
				this.subjects = responseSubjects;
				this.dataSource = this.subjects;
			});
		this.subscriptions.add(sub);
	}
	onSuccess(data) {
		alert('You have successfully saved the subject.');
		this.navigator.goToPage('/home/subject-handler');
	}
	onError(error) {
		if (error.status === 401) {
			alert('Not athorized. Please log in and try again');
			this.navigator.goToPage('/login');
		} else if (error.status === 405) {
			alert('Error. Check if the name or abbreviation already exist.');
		} else {
			alert(
				'Error. Something went wrong while trying to save or edit the academy.'
			);
		}
	}
}
