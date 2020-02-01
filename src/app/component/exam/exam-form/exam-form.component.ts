import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { Exam } from '../../../model/exam.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../service/exam.service';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course.model';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { StatusMessageService } from 'src/app/service/status-message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';

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

	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	form: FormGroup;
	subscriptions: Subscription = new Subscription();

	createFormId: number = 0;
	exam: Exam = new Exam();
	id: number;
	returnNav: string;

	isUnpublishedSelector = false;
	academies: Academy[];
	subjects: Subject[];
	courses: Course[];
	subjectsFilteredByAcademyId: Subject[];
	coursesFilteredBySubjectId: Course[];

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private service: ExamService,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		private courseService: CourseService,
		public navigator: Navigator,
		private dialog: MatDialog,
		private statusMessageService: StatusMessageService
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({
			academy: '',
			subject: '',
			course: '',
			filename: '',
			date: '',
			unpublishDate: ''
		});

		let sub = this.academyService.getAllAcademies().subscribe(
			responseAcademies => {
				this.academies = responseAcademies
			},
			error => this.onError(error)
		);
		this.subscriptions.add(sub);

		sub = this.subjectService.getAllSubjects().subscribe(
			responseSubjects => {
				this.subjects = responseSubjects
			},
			error => this.onError(error)
		);
		this.subscriptions.add(sub);

		sub = this.courseService.getAllCourses().subscribe(
			responseCourses => {
				this.courses = responseCourses
			},
			error => this.onError(error)
		);
		this.subscriptions.add(sub);

		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.returnNav = params.get('returnNav');
				this.handleId(this.id);
			})
		);
	}

	handleId(id: number) {
		const dsub = this.service.getExamById(this.id).subscribe(exam => {
			this.exam = exam;

			this.isUnpublishedSelector = exam.unpublished;
			let course = this.findCourseById(exam.courseId);
			let subject = this.findSubjectById(course.subjectId);
			let academy = this.findAcademyById(subject.academyId);

			const isInitialized = false;
			this.selectedAcademy(academy.id, isInitialized);
			this.selectedSubject(subject.id, isInitialized);
			this.selectedCourse(course.id);

			this.form = this.formBuilder.group({
				filename: exam.filename,
				date: exam.date,
				unpublishDate: exam.unpublishDate,
				academy: academy.id,
				subject: subject.id,
				course: course.id
			});
			this.exam.unpublished = exam.unpublished;

		});
		this.subscriptions.add(dsub);

	}

	findCourseById(courseId: number) {
		return this.courses.find(course => course.id == courseId);
	}

	findSubjectById(subjectId: number) {
		return this.subjects.find(subject => subject.id == subjectId);
	}

	findAcademyById(academyId: number) {
		return this.academies.find(academy => academy.id == academyId);
	}

	selectedAcademy(academyId: number, isInitialized = true) {
		this.subjectsFilteredByAcademyId = this.subjects.filter(subject => subject.academyId == academyId);
		if (this.subjectsFilteredByAcademyId && this.subjectsFilteredByAcademyId.length > 0) {
			if (isInitialized) {
				this.selectedSubject(this.subjectsFilteredByAcademyId[0].id);
			}
		} else {
			this.selectedSubject(0);
			this.selectedCourse(0);
		}
	}

	selectedSubject(subjectId: number, isInitialized = true) {
		this.form.get("subject").setValue(subjectId);
		this.coursesFilteredBySubjectId = this.courses.filter(course => course.subjectId == subjectId);
		if (this.coursesFilteredBySubjectId && this.coursesFilteredBySubjectId.length > 0) {
			if (isInitialized) {
					this.selectedCourse(this.coursesFilteredBySubjectId[0].id);
			} 
		} else {
			this.selectedCourse(0);
		}
	}

	selectedCourse(courseId: number) {
		this.form.get("course").setValue(courseId);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			this.exam.filename = this.form.controls.filename.value;
			this.exam.date = this.form.controls.date.value;
			this.exam.unpublishDate = this.form.controls.unpublishDate.value;
			this.exam.courseId = this.form.controls.course.value;

			const sub = this.service.saveExam(this.exam).subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
			this.subscriptions.add(sub);
		}
	}

	onSuccess(data: any) {
		this.form.reset();
		(!this.returnNav)
			? this.navigator.goToPage('/admin/exam-handler')
			: this.navigator.goToPage('/admin/outbox')

		this.statusMessageService.showSuccessMessage(data.name + " was " +
			((this.id == this.createFormId) ? "created" : "updated"));
	}

	onError(error: HttpErrorResponse) {
		if (error.status === 401) {
			this.statusMessageService.showErrorMessage('Not authorized. Please log in and try again', 'Error');
			this.navigator.goToPage('/login');
		} else {
			throw (error);
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
