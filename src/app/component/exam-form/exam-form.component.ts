import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { Exam } from '../../model/exam.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../service/exam.service';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course.model';
import { ConfirmationAckDialogComponent } from '../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

export interface CustomBooleanArray {
	value: boolean;
	viewValue: string;
}

@Component({
	selector: 'app-address-form',
	templateUrl: './exam-form.component.html',
	styleUrls: ['./exam-form.component.scss'],
	providers: [Navigator]
})
export class ExamFormComponent implements OnInit, OnDestroy {
	boolean: CustomBooleanArray[] = [
		{ value: false, viewValue: 'False' },
		{ value: true, viewValue: 'True' }
	];

	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	form: FormGroup;
	subscriptions: Subscription = new Subscription();

	FORM_TYPE = { CREATE: 0 };
	exam: Exam = new Exam();
	id: number;

	isUnpublishedSelector = false;
	courses: Course[];
	titleText: string;
	buttonText: string;

	constructor(
		private formBuilder: FormBuilder, private route: ActivatedRoute, private service: ExamService, private courseService: CourseService,
		private navigator: Navigator, private dialog: MatDialog
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			filename: '',
			date: '',
			unpublishDate: '',
			unpublished: '',
			course: ''
		});

		const sub = this.courseService.getAllCourses().subscribe(responseResult => {
			this.courses = responseResult;
		});
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.createForm(this.id);
			})
		);
	}

	createForm(id: number) {
		this.setEditFormText();
		const sub = this.service.getExamById(id).subscribe(exam => {
			this.exam = exam;
			this.isUnpublishedSelector = exam.unpublished;
			this.form = this.formBuilder.group({
				filename: exam.filename,
				date: exam.date,
				unpublishDate: exam.unpublishDate,
				unpublished: exam.unpublished,
				course: exam.courseId
			});
		});
		this.subscriptions.add(sub);

	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			this.exam.filename = this.form.controls.filename.value;
			this.exam.date = this.form.controls.date.value;
			this.exam.unpublishDate = this.form.controls.unpublishDate.value;
			this.exam.unpublished = this.form.controls.unpublished.value;
			this.exam.courseId = this.form.controls.course.value;

			const sub = this.service.saveExam(this.exam).subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
			this.subscriptions.add(sub);
		}
	}

	setEditFormText() {
		this.titleText = 'Edit Exam';
		this.buttonText = 'Save';
	}

	onSuccess(data: any) {
		this.form.reset();
		this.navigator.goToPage('/home/exam-handler');
		this.openAcknowledgeDialog(data.filename + " was updated", 'success');
	}

	onError(error) {
		if (error.status === 401) {
			this.openAcknowledgeDialog('Not authorized. Please log in and try again', 'error');
			this.navigator.goToPage('/login');
		} else if (error.status === 409) {
			this.openAcknowledgeDialog('The filename already exists as an exam.', 'error');
		} else {
			this.openAcknowledgeDialog('Something went wrong while trying to save the exam.', 'error');
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
