import { Component, OnInit, OnDestroy } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-course-handler',
	templateUrl: 'course-handler.component.html',
	styleUrls: ['course-handler.component.scss'],
	providers: [Navigator]
})
export class CourseHandlerComponent implements OnInit, OnDestroy {
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'edit'];
	academies = [];
	subjects = [];
	courses = [];
	selection = new SelectionModel<Course>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	isUnpublishButtonDisabled = true;
	selectedAcademyValue: number;
	selectedSubjectValue: number;

  constructor(private academyService: AcademyService, private subjectService: SubjectService,
    private courseService: CourseService, public navigator: Navigator, private dialog: MatDialog){}
	ngOnInit() {
		const sub = this.academyService
			.getAllAcademies()
			.subscribe(responseAcademies => {
				this.academies = responseAcademies;
				this.selectedAcademyValue = this.academies[0].id;
				this.selectedAcademy(this.selectedAcademyValue);
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(academyId: number) {
		const sub = this.subjectService
			.getAllSubjectsByAcademyId(academyId)
			.subscribe(responseSubjects => {
				this.subjects = responseSubjects;
				this.selectedSubjectValue = this.subjects[0].id;
				this.selectedSubject(this.selectedSubjectValue);
			});
		this.subscriptions.add(sub);
	}

	selectedSubject(subjectId: number) {
		const sub = this.courseService
			.getAllCoursesBySubjectId(subjectId)
			.subscribe(responseCourses => {
				this.courses = responseCourses;
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
				const selectedCourses = this.selection.selected;
				let dSub;
					for (let course of selectedCourses) {
						course.unpublished = true;
					}
					dSub = this.courseService.unpublishCourses(selectedCourses).subscribe(
						data => this.onSuccess(data),
						error => this.onError(error)
					);
				
				this.subscriptions.add(dSub);
				for (let course of selectedCourses) {
					this.courses = this.courses.filter(x => x.id != course.id);
				}
			}
			this.dialogRef = null;

		});
		this.subscriptions.add(sub);
	}

	makeContentText() {
		const numberOfSelected = this.selection.selected.length;
		let dutyText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " courses";

		return dutyText = dutyText.concat(contentText);
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

	// For the checkboxes
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.courses.length;
		return numSelected === numRows;
	}
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.courses.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isUnpublishButtonDisabled = false : this.isUnpublishButtonDisabled = true;
	}
	onSuccess(data: any) {
		const selectedCourses = this.selection.selected;
		for (let subject of selectedCourses) {
			this.courses = this.courses.filter(x => x.id != subject.id);
		}
		const successfulAmount = data.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " course" : " courses") : "";
		let successfulDutyText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulDutyText = successfulContentText.concat(successfulDutyText);
		this.openAcknowledgeDialog(successfulDutyText, "publish");
		this.selection.clear();
	}

	onError(error: HttpErrorResponse) {
		this.openAcknowledgeDialog("Something went wrong\nError: " + error.statusText, "publish");
	}
}

