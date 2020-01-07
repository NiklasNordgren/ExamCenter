import { Component, OnInit } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { faUserPlus, faUsersCog, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SubjectService } from '../../service/subject.service';
import { Subject } from '../../model/subject.model';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';


@Component({
	selector: 'app-subject-handler',
	templateUrl: './subject-handler.component.html',
	styleUrls: ['./subject-handler.component.scss'],
	providers: [Navigator]
})
export class SubjectHandlerComponent {

	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<Subject>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	subjects = [];
	dialogRef: MatDialogRef<ConfirmationDialog>;
	displayedColumns: string[] = [ 'select', 'name', 'code', 'edit'];

	constructor(private service: SubjectService, private navigator: Navigator, private dialog: MatDialog) {

	 }

	ngOnInit() {
		this.service.getAllSubjects().subscribe(responseUsers => {
			
			this.subjects = responseUsers;
		});
  	}

	openDeleteDialog() {
		
		let numberOfSelected = this.selection.selected.length;

		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete " + numberOfSelected + " subject(s)?";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";  

		this.dialogRef.afterClosed().subscribe(result => {
			if(result) {
				for (let subject of this.selection.selected) {
					this.service.deleteSubject(subject.id);
					this.subjects = this.subjects.filter(x => x.id != subject.id); 
				}
			}				
			this.dialogRef = null;
		});
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.subjects.length;
		return numSelected === numRows;
	  }
	
	  /** Selects all rows if they are not all selected; otherwise clear selection. */
	  masterToggle() {
		this.isAllSelected() ?
		  this.selection.clear() :
		  this.subjects.forEach(row => this.selection.select(row));
	  }
}
