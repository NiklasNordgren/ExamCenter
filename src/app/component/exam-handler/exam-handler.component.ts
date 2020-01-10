import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import {
	faPlus,
	faUsersCog,
	faSearch,
	faPen,
	faTrash
} from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../../service/exam.service';
import { Exam } from '../../model/exam.model';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CourseService } from 'src/app/service/course.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-exam-handler',
	templateUrl: './exam-handler.component.html',
	styleUrls: ['./exam-handler.component.scss'],
	providers: [Navigator]
})
export class ExamHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	faPlus = faPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<Exam>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	academies = [];
	subjects = [];
	courses = [];
	exams: Exam[] = [];

	selectedAcademyValue: number;
	selectedSubjectValue: number;
	selectedCourseValue: number;

	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	displayedColumns: string[] = [
		'select',
		'filename',
		'date',
		'unpublishDate',
		'unpublished',
		'edit'
	];

	constructor(
		private examService: ExamService,
		private courseService: CourseService,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		private navigator: Navigator,
		private dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		const sub = this.academyService
			.getAllAcademies()
			.subscribe(responseResult => {
				this.academies = responseResult;
				this.selectedAcademyValue = this.academies[0].id;
				this.selectedAcademy(this.selectedAcademyValue);
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(id: number) {
		const sub = this.subjectService
			.getAllSubjectsByAcademyId(id)
			.subscribe(responseResult => {
				this.subjects = responseResult;
				this.selectedSubjectValue = this.subjects[0].id;
				this.selectedSubject(this.selectedSubjectValue);
			});
		this.subscriptions.add(sub);
	}

	selectedSubject(id: number) {
		const sub = this.courseService
			.getAllCoursesBySubjectId(id)
			.subscribe(responseResult => {
				this.courses = responseResult;
			});
		this.subscriptions.add(sub);
	}

	selectedCourse(id: number) {
		const sub = this.examService
			.getAllExamsByCourseId(id)
			.subscribe(responseResult => {
				this.exams = responseResult;
			});
		this.subscriptions.add(sub);
	}

	openDeleteDialog() {
		const numberOfSelected = this.selection.selected.length;

		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
		});
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.contentMessage = "Are you sure you want to delete " + numberOfSelected + " exam(s)?";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				for (let exam of this.selection.selected) {
					this.examService.deleteExam(exam.id);
					this.exams = this.exams.filter(x => x.id != exam.id);
				}
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.exams.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.exams.forEach(row => this.selection.select(row));
	}
}
