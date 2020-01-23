import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
	selector: 'app-admin-handler',
	templateUrl: './admin-handler.component.html',
	styleUrls: ['./admin-handler.component.scss'],
	providers: [Navigator]
})
export class AdminHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<User>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	users = [];
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	displayedColumns: string[] = ['select', 'name', 'isSuperUser', 'edit'];
	isDeleteButtonDisabled = true;

	constructor(private service: UserService, public navigator: Navigator,	private dialog: MatDialog) {
	}

	ngOnInit() {
		const sub = this.service.getAllUsers().subscribe(responseUsers => {
			this.users = responseUsers;
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	openDeleteDialog() {
		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Confirm';
		this.dialogRef.componentInstance.contentMessage = this.makeDeleteContentText();
		this.dialogRef.componentInstance.confirmBtnText = 'Delete';

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				for (let user of this.selection.selected) {
					const dSub = this.service.deleteUser(user.id).subscribe(result => {
					});
					this.subscriptions.add(dSub);
					this.users = this.users.filter(x => x.id !== user.id);
				}
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	makeDeleteContentText() {
		const numberOfSelected = this.selection.selected.length;
		let dutyText = "Are you sure you want to delete\n\n";
		let contentText = (numberOfSelected == 1) ? this.selection.selected[0].name : numberOfSelected + " admins";
		
		return dutyText = dutyText.concat(contentText);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.users.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.users.forEach(row => this.selection.select(row));
		this.isAnyCheckboxSelected();
	}

	isAnyCheckboxSelected() {
		(this.selection.selected.length !== 0) ? this.isDeleteButtonDisabled = false : this.isDeleteButtonDisabled = true;
	}
}
