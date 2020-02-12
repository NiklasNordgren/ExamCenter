import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import {
	faUserPlus,
	faUsersCog,
	faSearch,
	faPen,
	faTrash
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/user.model';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessageService } from 'src/app/service/status-message.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
	selector: 'app-admin-handler',
	templateUrl: './admin-handler.component.html',
	styleUrls: ['./admin-handler.component.scss'],
	providers: [Navigator]
})
export class AdminHandlerComponent implements OnInit, OnDestroy {
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	subscriptions: Subscription = new Subscription();
	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<User>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	userSource = new MatTableDataSource<User>();
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	displayedColumns: string[] = ['select', 'name', 'isSuperUser', 'edit'];
	isDeleteButtonDisabled = true;

	constructor(private service: UserService, 
		public navigator: Navigator, 
		private dialog: MatDialog,
		private statusMessageService: StatusMessageService) { }

	ngOnInit() {
		this.userSource.sort = this.sort;
		const sub = this.service.getAllUsers().subscribe(responseUsers => {
			this.userSource.data = responseUsers;
		});
		this.subscriptions.add(sub);
		
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	openDeleteDialog() {
		if (!this.isLastSuperUsers()) {
			this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
			this.dialogRef.componentInstance.titleMessage = 'Confirm';
			this.dialogRef.componentInstance.contentMessage = this.makeDeleteContentText();
			this.dialogRef.componentInstance.confirmBtnText = 'Delete';

			const sub = this.dialogRef.afterClosed().subscribe(result => {
				if (result) {
					for (let user of this.selection.selected) {
						const dSub = this.service.deleteUser(user.id).subscribe();
						this.subscriptions.add(dSub);
						this.userSource.data = this.userSource.data.filter(x => x.id !== user.id);
					}
					this.onSuccess();
					this.isAnyCheckboxSelected();
				}
				this.dialogRef = null;
			});
			this.subscriptions.add(sub);
		} else {
			this.statusMessageService.showErrorMessage("Error", "Cannot delete the last or all super user administator accounts");
		}
	}

	isLastSuperUsers() {
		const selectedAdmins = this.selection.selected;
		const superUsers = this.userSource.data.filter(x => x.isSuperUser == true);
		const union = superUsers.filter(x => selectedAdmins.includes(x));
		return (union.length == superUsers.length);
	}

	makeDeleteContentText() {
		const numberOfSelected = this.selection.selected.length;
		let serviceText = "Are you sure you want to delete\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " admins";

		return serviceText = serviceText.concat(contentText);
	}

	onSuccess() {
		const selectedAdmins = this.selection.selected;
		for (let admin of selectedAdmins) {
			this.userSource.data = this.userSource.data.filter(x => x.id != admin.id);
		}
		
		let successfulContentText = (selectedAdmins.length !== 0)
			? selectedAdmins.length + ((selectedAdmins.length == 1)
				? " administrator"
				: " administators")
			: "";
		let successfulServiceText = (successfulContentText.length !== 0) ? " got deleted" : "";
		successfulServiceText = successfulContentText.concat(successfulServiceText);
		this.selection.clear();
		this.statusMessageService.showSuccessMessage(successfulServiceText);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.userSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.userSource.data.forEach(row => this.selection.select(row));
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isDeleteButtonDisabled = false : this.isDeleteButtonDisabled = true;
	}
}
