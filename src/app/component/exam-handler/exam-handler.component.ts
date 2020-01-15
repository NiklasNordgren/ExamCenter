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
import { ConfirmationAckDialogComponent } from '../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

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

	successfulHttpRequest: Array<String>;
	errorHttpRequest: Array<any> = [];

	isDeleteButtonDisabled = true;
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
		private navigator: Navigator,
		private dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	ngOnInit() {
		const sub = this.academyService.getAllAcademies().subscribe(responseResult => {
			this.academies = responseResult;
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(id: number) {
		const sub = this.subjectService.getAllSubjectsByAcademyId(id).subscribe(responseResult => {
			this.subjects = responseResult;
		});
		this.subscriptions.add(sub);
	}

	selectedSubject(id: number) {
		const sub = this.courseService.getAllCoursesBySubjectId(id).subscribe(responseResult => {
			this.courses = responseResult;
		});
		this.subscriptions.add(sub);
	}

	selectedCourse(id: number) {
		const sub = this.examService.getAllExamsByCourseId(id).subscribe(responseResult => {
			this.exams = responseResult;
		});
		this.subscriptions.add(sub);
	}

	openDialog(duty: string) {

		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeContentText(duty);
		this.dialogRef.componentInstance.confirmBtnText = duty;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const selectedExams = this.selection.selected;
				let dSub;
				if (duty == "delete") {
					dSub = this.examService.deleteExams(selectedExams).subscribe(data => {
					});
				} else if (duty == "unpublish") {
					for (let exam of selectedExams) {
						exam.unpublished = true;
					}
					dSub = this.examService.publishExams(selectedExams).subscribe(
						data => this.onSuccess(data),
						error => this.onError(error),
						() => this.manageRequestResults(duty)
					);
				}
				this.subscriptions.add(dSub);
				for (let exam of selectedExams) {
					this.exams = this.exams.filter(x => x.id != exam.id);
				}
			}
			this.dialogRef = null;

		});
		this.subscriptions.add(sub);
	}

	onSuccess(data: any) {
		this.successfulHttpRequest = data;
	}

	onError(error: any) {
		this.errorHttpRequest = error;
	}

	manageRequestResults(duty: string) {
		const successfulAmount = this.successfulHttpRequest.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " exam" : " exams") : "";
		let successfulDutyText = (successfulContentText.length !== 0) ? " got " + duty + ((duty === "delete") ? "d" : "ed") : "";
		successfulDutyText = successfulContentText.concat(successfulDutyText);

		const errorAmount = this.errorHttpRequest.length;
		let errorContentText= "";
		if (errorAmount !== 0) {
			errorContentText = "Something went wrong";
			for (let error of this.errorHttpRequest) {
				errorContentText = errorContentText.concat("\nError: " + error.status);
			}
		}
		(successfulDutyText.length !== 0 && errorContentText.length !== 0) ? successfulDutyText.concat(successfulDutyText + "\n\n") : "";
		const message = successfulDutyText.concat(errorContentText);
		this.openAcknowledgeDialog(message, "publish");
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

	makeContentText(duty: string) {
		const numberOfSelected = this.selection.selected.length;
		let dutyText = "Are you sure you want to " + duty + "\n\n";
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
		(this.selection.selected.length !== 0) ? this.isDeleteButtonDisabled = false : this.isDeleteButtonDisabled = true;
	}
}
