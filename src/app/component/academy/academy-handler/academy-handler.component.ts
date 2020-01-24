import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-academy-handler',
	styleUrls: ['academy-handler.component.scss'],
	templateUrl: 'academy-handler.component.html',
	providers: [Navigator]
})
export class AcademyHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'abbriviation', 'edit'];
	academies = [];
	selection = new SelectionModel<Academy>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	isUnpublishButtonDisabled = true;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	successfulHttpRequest: Array<String>;
	errorHttpRequest: Array<any> = [];

	constructor(private service: AcademyService, public navigator: Navigator, private dialog: MatDialog) {}

	ngOnInit() {
		const sub = this.service.getAllAcademies().subscribe(responseAcademies => {
			this.academies = responseAcademies;
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.academies.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.academies.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isUnpublishButtonDisabled = false : this.isUnpublishButtonDisabled = true;
	}

	makeContentText() {
		const numberOfSelected = this.selection.selected.length;
		let dutyText = "Are you sure you want to unpublish" + "\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " academies";

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

	openDialog() {
		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeContentText();
		this.dialogRef.componentInstance.confirmBtnText = "unpublish";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				const selectedAcademies = this.selection.selected;
				let dSub;
					for (let academy of selectedAcademies) {
						academy.unpublished = true;
					}
					dSub = this.service.unpublishAcademies(selectedAcademies).subscribe(
						data => this.onSuccess(data),
						error => this.onError(error)
					);
				
				this.subscriptions.add(dSub);
				for (let academy of selectedAcademies) {
					this.academies = this.academies.filter(x => x.id != academy.id);
				}
			}
			this.dialogRef = null;

		});
		this.subscriptions.add(sub);
	}
	onSuccess(data: any) {
		const selectedAcademies = this.selection.selected;
		for (let academy of selectedAcademies) {
			this.academies = this.academies.filter(x => x.id != academy.id);
		}
		const successfulAmount = data.length;
		let successfulContentText = (successfulAmount !== 0) ? successfulAmount + ((successfulAmount == 1) ? " academy" : " academies") : "";
		let successfulDutyText = (successfulContentText.length !== 0) ? " got unpublished" : "";
		successfulDutyText = successfulContentText.concat(successfulDutyText);
		this.openAcknowledgeDialog(successfulDutyText, "publish");
		this.selection.clear();
	}

	onError(error: HttpErrorResponse) {
		this.openAcknowledgeDialog("Something went wrong\nError: " + error.statusText, "publish");
	}

}
