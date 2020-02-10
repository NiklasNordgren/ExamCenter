import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { faPlus, faPen, faTrash, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessageService } from 'src/app/service/status-message.service';

@Component({
	selector: 'app-course-handler',
	templateUrl: 'course-handler.component.html',
	styleUrls: ['course-handler.component.scss'],
	providers: [Navigator]
})
export class CourseHandlerComponent implements OnInit, OnDestroy {
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'courseCode', 'edit'];
	academies = [];
	subjects = [];
	courseSource = new MatTableDataSource<Course>();
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
		this.courseSource.sort = this.sort;
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
				if (this.subjects.length > 0) {
					this.selectedSubjectValue = this.subjects[0].id;
					this.selectedSubject(this.selectedSubjectValue);
				} else {
					this.selectedSubjectValue = 0;
					this.selectedSubject(this.selectedSubjectValue);
				}
			});
		this.subscriptions.add(sub);
	}

	selectedSubject(subjectId: number) {
		const sub = this.courseService.getAllCoursesBySubjectId(subjectId).subscribe(
			responseCourses => {
				this.courseSource.data = responseCourses;
			});
		this.subscriptions.add(sub);
	}

	// For the checkboxes
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.courseSource.data.length;
		return numSelected === numRows;
	}
	// Selects all rows if they are not all selected; otherwise clear selection.
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.courseSource.data.forEach(row => this.selection.select(row));
	}

	openDialog() {
		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeContentText();
		this.dialogRef.componentInstance.confirmBtnText = "unpublish";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const selectedCourses = this.selection.selected;
				const isUnpublished = true;
				let dSub;
				dSub = this.courseService.publishCourses(selectedCourses, isUnpublished).subscribe(
					data => this.onSuccess(data),
					error => this.onError(error)
				);

				this.subscriptions.add(dSub);
				for (let course of selectedCourses) {
					this.courseSource.data = this.courseSource.data.filter(x => x.id != course.id);
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
			this.courseSource.data = this.courseSource.data.filter(x => x.id != subject.id);
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
