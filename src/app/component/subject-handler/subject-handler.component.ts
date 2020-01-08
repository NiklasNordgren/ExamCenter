import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { faUserPlus, faUsersCog, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SubjectService } from '../../service/subject.service';
import { Subject } from '../../model/subject.model';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { AcademyService } from 'src/app/service/academy.service';

export interface customSubjectArray {
	id: number;
	name: string;
	code: string;
	academyName: string;
}

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

	subjectArray: Array<customSubjectArray> = [];
	isLoaded = false;
	subjects = [];
	academies = [];
	academyNames: string[] = [];
	dialogRef: MatDialogRef<ConfirmationDialog>;
	displayedColumns: string[] = ['select', 'name', 'code', 'academy', 'edit'];

	constructor(private changeDetectorRef: ChangeDetectorRef, private service: SubjectService, private academyService: AcademyService, private navigator: Navigator, private dialog: MatDialog) {

	}

	ngOnInit() {
		this.service.getAllSubjects().subscribe(responseSubjects => {

			//this.subjects = responseSubjects;
		//	this.convertSubjectArray(responseSubjects);
			this.getAllAcademies(responseSubjects);
			/*for (let subject of this.subjects) {
				this.getAcademyById(subject.academyId);
			} */
			console.log(this.subjectArray);


		});
	}

	getAllAcademies(subjects: Subject[]) {
		this.academyService.getAllAcademies().subscribe(academies => {

			for (let subject of subjects) {


				for (let academy of academies) {
					

					if (subject.academyId == academy.id) {
						this.subjectArray.push({ id: subject.id, name: subject.name, code: subject.code, academyName: academy.name });

						console.log("found");

					}
				}

				console.log(this.academyNames);

			}
			this.isLoaded = true;
			this.changeDetectorRef.detectChanges();
			
		});

	}

	getAcademyById(id: number) {
		this.academyService.getAcademyById(id).subscribe(academy => {
			this.academyNames.push(academy.name);
			console.log(this.academyNames);
			return academy.name;
			//		return academy.name;
			//	this.academy = new Academy();
			//	this.academy.name = academy.name;
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
			if (result) {
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
