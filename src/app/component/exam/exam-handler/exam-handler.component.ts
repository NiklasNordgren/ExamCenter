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
import { ExamService } from '../../../service/exam.service';
import { Exam } from '../../../model/exam.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { CourseService } from 'src/app/service/course.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { Subscription } from 'rxjs';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

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

	isUnpublishButtonDisabled = true;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	displayedColumns: string[] = [
		'select',
		'filename',
		'date',
		'unpublishDate',
		'edit'
	];

	constructor(
		private examService: ExamService,
		private courseService: CourseService,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		public navigator: Navigator,
		private dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		const sub = this.academyService.getAllAcademies().subscribe(responseResult => {
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
		const sub = this.subjectService.getAllSubjectsByAcademyId(id).subscribe(responseResult => {
			this.subjects = responseResult;
			this.selectedSubjectValue = this.subjects[0].id;
			this.selectedSubject(this.selectedSubjectValue);
		});
		this.subscriptions.add(sub);
	}

	selectedSubject(id: number) {
		const sub = this.courseService.getAllCoursesBySubjectId(id).subscribe(responseResult => {
			this.courses = responseResult;
			this.selectedCourseValue = this.courses[0].id;
			this.selectedCourse(this.selectedCourseValue);
		});
		this.subscriptions.add(sub);
	}

	selectedCourse(id: number) {
		const sub = this.examService.getAllExamsByCourseId(id).subscribe(responseResult => {
			this.exams = responseResult;
		});
		this.subscriptions.add(sub);
	}

	openDialog() {

		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeContentText();
		this.dialogRef.componentInstance.confirmBtnText = "unpublish";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const selectedExams = this.selection.selected;
				let dSub;
					for (let exam of selectedExams) {
						exam.unpublished = true;
					}
					
					dSub = this.examService.publishExams(selectedExams).subscribe(
						data => this.onSuccess(data)
					);
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	onSuccess(data: any) {
		const selectedExams = this.selection.selected;
		for (let exam of selectedExams) {
			this.exams = this.exams.filter(x => x.id != exam.id);
		}
		const successfulAmount = data.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " exam" : " exams") : "";
		let successfulDutyText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulDutyText = successfulContentText.concat(successfulDutyText);
		this.openAcknowledgeDialog(successfulDutyText, "publish");
		this.selection.clear();
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

	makeContentText() {
		const numberOfSelected = this.selection.selected.length;
		let dutyText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].filename : numberOfSelected + " exams";

		return dutyText = dutyText.concat(contentText);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.exams.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.exams.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isUnpublishButtonDisabled = false : this.isUnpublishButtonDisabled = true;
	}
}
