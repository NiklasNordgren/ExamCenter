import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'src/app/model/subject.model';
import { SubjectService } from 'src/app/service/subject.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
	selector: 'app-subject-handler',
	templateUrl: 'subject-handler.component.html',
	styleUrls: ['subject-handler.component.scss'],
	providers: [Navigator]
})
export class SubjectHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'code', 'edit'];
	academies = [];
	subjects = [];
	selection = new SelectionModel<Subject>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	selectedValue: number;
	isUnpublishButtonDisabled = true;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	successfulHttpRequest: Array<String>;
	errorHttpRequest: Array<any> = [];

	constructor(
		private subjectService: SubjectService,
		public navigator: Navigator,
		private academyService: AcademyService,
		private dialog: MatDialog,
	) {}

	ngOnInit() {
		const sub = this.academyService
			.getAllAcademies()
			.subscribe(responseAcademies => {
				this.academies = responseAcademies;
				this.selectedValue = this.academies[0].id;
				this.selectedAcademy(this.selectedValue);
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(academyId: number) {
		const sub = this.subjectService
			.getAllPublishedSubjectsByAcademyId(academyId)
			.subscribe(responseSubjects => {
				this.subjects = responseSubjects;
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
				const selectedSubjects = this.selection.selected;
				let dSub;
					for (let subject of selectedSubjects) {
						subject.unpublished = true;
					}
					dSub = this.subjectService.unpublishSubjects(selectedSubjects).subscribe(
						data => this.onSuccess(data),
						error => this.onError(error)
					);
				
				this.subscriptions.add(dSub);
				for (let subject of selectedSubjects) {
					this.subjects = this.subjects.filter(x => x.id != subject.id);
				}
			}
			this.dialogRef = null;

		});
		this.subscriptions.add(sub);
	}

	makeContentText() {
		const numberOfSelected = this.selection.selected.length;
		let serviceText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " subjects";

		return serviceText = serviceText.concat(contentText);
	}


	openAcknowledgeDialog(message: string, typeText: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = typeText;
		this.dialogRef.componentInstance.contentMessage = message;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	// For the checkboxes
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.subjects.length;
		return numSelected === numRows;
	}
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.subjects.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isUnpublishButtonDisabled = false : this.isUnpublishButtonDisabled = true;
	}

	onSuccess(data: any) {
		const selectedSubjects = this.selection.selected;
		for (let subject of selectedSubjects) {
			this.subjects = this.subjects.filter(x => x.id != subject.id);
		}
		const successfulAmount = data.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " subject" : " subjects") : "";
		let successfulServiceText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulServiceText = successfulContentText.concat(successfulServiceText);
		this.openAcknowledgeDialog(successfulServiceText, "publish");
		this.selection.clear();
	}

	onError(error: HttpErrorResponse) {
		this.openAcknowledgeDialog("Something went wrong\nError: " + error.statusText, "publish");
	}
}
