import { Component, OnInit } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { faUserPlus, faUsersCog, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';
import { User } from '../model/user.model';
import { ConfirmationDialog } from '../component/confirmation-dialog/confirmation-dialog';


@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
	providers: [Navigator]
})
export class AdminComponent {

	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<User>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	users = [];
	dialogRef: MatDialogRef<ConfirmationDialog>;
	displayedColumns: string[] = [ 'select', 'name', 'isSuperUser', 'edit'];

	constructor(private service: UserService, private navigator: Navigator, private dialog: MatDialog) {

	 }

	ngOnInit() {
		this.service.getAllUsers().subscribe(responseUsers => {
			
			this.users = responseUsers;
		});
  	}

	addAdmin() {
		console.log("clicked");
	}

	editAdmin(element) {
		console.log("edit admin " + element.id);
		
	}

	openDeleteDialog(element: any) {
		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";  

		this.dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.service.deleteUser(element.id);
				this.users = this.users.filter(x => x.id != element.id);
			}				
			this.dialogRef = null;
		});
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.users.length;
		return numSelected === numRows;
	  }
	
	  /** Selects all rows if they are not all selected; otherwise clear selection. */
	  masterToggle() {
		this.isAllSelected() ?
		  this.selection.clear() :
		  this.users.forEach(row => this.selection.select(row));
	  }
}
