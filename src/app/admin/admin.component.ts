import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { faUserPlus, faUsersCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';
import { ConfirmationDialog } from '../component/confirmation-dialog/confirmation-dialog';


@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	users = [];
	dialogRef: MatDialogRef<ConfirmationDialog>;
	displayedColumns: string[] = [ 'name', 'superUser', 'actions'];

	constructor(private router: Router, private service: UserService, private dialog: MatDialog) {

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
}
