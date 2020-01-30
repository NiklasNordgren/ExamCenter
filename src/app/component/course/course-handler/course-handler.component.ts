import { Component, OnInit, OnDestroy } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessageService } from 'src/app/service/status-message.service';

@Component({
	selector: 'app-course-handler',
	templateUrl: 'course-handler.component.html',
	styleUrls: ['course-handler.component.scss'],
	providers: [Navigator]
})
export class CourseHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'courseCode', 'edit'];
	academies = [];
	subjects = [];
	courses = [];
	dataSource = [];
	selection = new SelectionModel<Course>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	faBookOpen = faBookOpen;
	public selectedAcademyValue: number;
	public selectedSubjectValue: number;
	isUnpublishButtonDisabled = true;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	

	constructor(private academyService: AcademyService, 
		private subjectService: SubjectService,
		private courseService: CourseService, 
		public navigator: Navigator, 
		private dialog: MatDialog,
		private statusMessageService: StatusMessageService) { }
		
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
				this.dataSource = this.courses;
			});
		this.subscriptions.add(sub);
	}

	// For the checkboxes
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.length;
		return numSelected === numRows;
	}
	// Selects all rows if they are not all selected; otherwise clear selection.
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.forEach(row => this.selection.select(row));
	}
	unpublishSelection() {
		const sub = this.courseService
			.unpublishCourses(this.selection.selected)
			.subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
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
				for (let subject of selectedCourses) {
					subject.unpublished = true;
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
		let serviceText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " courses";

		return serviceText = serviceText.concat(contentText);
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
		let successfulContentText = (successfulAmount !== 0)
			? successfulAmount + ((successfulAmount == 1)
				? " course"
				: " courses")
			: "";
		let successfulServiceText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulServiceText = successfulContentText.concat(successfulServiceText);
		this.statusMessageService.showSuccessMessage(successfulServiceText);
		this.selection.clear();
	}

	onError(error: HttpErrorResponse) {
		this.statusMessageService.showErrorMessage("Error", "Something went wrong\nError: " + error.statusText);
	}
}
