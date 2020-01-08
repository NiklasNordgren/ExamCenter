import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Navigator } from 'src/app/util/navigator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { faUserPlus, faUsersCog, faSearch, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../../service/exam.service';
import { Exam } from '../../model/exam.model';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { CourseService } from 'src/app/service/course.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { MatTableDataSource } from '@angular/material';

export interface customExamArray {
	id: number;
	filename: string;
  date: Date;
  unpublishDate: Date;
  unpublished: boolean;
	academyName: string;
}

@Component({
	selector: 'app-exam-handler',
	templateUrl: './exam-handler.component.html',
	styleUrls: ['./exam-handler.component.scss'],
	providers: [Navigator]
})
export class ExamHandlerComponent implements OnInit{

	faUserPlus = faUserPlus;
	faUsersCog = faUsersCog;
	faSearch = faSearch;

	selection = new SelectionModel<Exam>(true, []);
	faPen = faPen;
	faTrash = faTrash;

	examArray: Array<customExamArray> = [];
  	academies = [];
  	subjects = [];
  	courses = [];
  	exams: Exam[] = [];

  	selectedAcademyValue: number;
  	selectedSubjectValue: number;
  	selectedCourseValue: number;

	dialogRef: MatDialogRef<ConfirmationDialog>;
	displayedColumns: string[] = ['select', 'filename', 'date', 'unpublishDate', 'unpublished', 'edit'];
  
 	constructor(private service: ExamService, private courseService: CourseService, private subjectService: SubjectService,
    	private academyService: AcademyService, private navigator: Navigator, 
    	private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {

	}

	ngOnInit() {
		this.academyService.getAllAcademies().subscribe(responseResult => {
			this.academies = responseResult;
			this.selectedAcademyValue = this.academies[0].id;
      		this.selectedAcademy(this.selectedAcademyValue);
		});
	}

  selectedAcademy(id: number) {
    this.subjectService.getAllSubjectsByAcademyId(id).subscribe(responseResult => {
		this.subjects = responseResult;
		this.selectedSubjectValue = this.subjects[0].id;
		this.selectedSubject(this.selectedSubjectValue);

    });
  }

  selectedSubject(id: number) {
    this.courseService.getAllCoursesBySubjectId(id).subscribe(responseResult => {
      this.courses = responseResult;
    });
  }
  
  selectedCourse(id: number) {
    this.service.getAllExamsByCourseId(id).subscribe(responseResult => {
      this.exams = responseResult;
    });
  }

  
  
	openDeleteDialog() {

		let numberOfSelected = this.selection.selected.length;

		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete " + numberOfSelected + " exam(s)?";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";

		this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				for (let exam of this.selection.selected) {
					this.service.deleteExam(exam.id);
					this.exams = this.exams.filter(x => x.id != exam.id);
				}
			}
			this.dialogRef = null;
		});
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.exams.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.exams.forEach(row => this.selection.select(row));
	}
}
