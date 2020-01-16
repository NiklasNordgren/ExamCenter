import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Academy } from 'src/app/model/academy.model';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationAckDialogComponent } from '../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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

	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		private navigator: Navigator,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		
		this.form = this.formBuilder.group({
			academy: '',
			code: '',
			name: ''
		});
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
		this.form.reset();
		this.navigator.goToPage('/home/subject-handler');
		this.openAcknowledgeDialog(data.name + " was updated", 'success');
	}
	onError(error) {
		if (error.status === 401) {
			this.navigator.goToPage('/login');
			this.openAcknowledgeDialog('Not authorized. Please log in and try again', 'error');
		} else if (error.status === 405) {
			this.openAcknowledgeDialog('Check if the name or abbreviation already exists.', 'error');
		} else {
			this.openAcknowledgeDialog('Something went wrong while trying to save or edit the academy.', 'error');
		}
	} 

	openAcknowledgeDialog(erorrMessage: string, typeText: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = typeText;
		this.dialogRef.componentInstance.contentMessage = erorrMessage;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}
}
