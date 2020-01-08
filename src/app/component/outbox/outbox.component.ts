
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFileMedical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExamService } from '../../service/exam.service';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { CourseService } from 'src/app/service/course.service';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Exam } from 'src/app/model/exam.model';
import { Course } from 'src/app/model/course.model';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';

export class CustomExam {
	id: number;
	filename: string;
	date: Date;
	unpublishDate: Date;
	courseName: string;
}

export class CustomCourse {
	id: number;
	name: string;
	courseCode: string;
	subjectId: number;
	subjectName: string;
}

export class CustomSubject {
	id: number;
	name: string;
	code: string;
	academyName: string;
}

@Component({
	selector: 'app-outbox',
	templateUrl: './outbox.component.html',
	styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {

	dialogRef: MatDialogRef<ConfirmationDialog>;

	faFileMedical = faFileMedical;
	faTrash = faTrash;

	examArray: Array<CustomExam> = [];
	courseArray: Array<CustomCourse> = [];
	subjectArray: Array<CustomSubject> = [];
	academyArray = [];

	//exams = [];
	courses = [];
	subjects = [];
	academies = [];

	showExams = false;
	showCourses = false;
	showSubjects = false;
	showAcademies = false;

	examSelection = new SelectionModel<CustomExam>(true, []);
	courseSelection = new SelectionModel<CustomCourse>(true, []);
	subjectSelection = new SelectionModel<CustomSubject>(true, []);
	academySelection = new SelectionModel<Academy>(true, []);

	clickedId: number;
	displayedExamColumns: string[] = ['select', 'filename', 'date', 'unpublishDate', 'courseName', 'actions'];
	displayedCourseColumns: string[] = ['select', 'name', 'courseCode', 'subjectName', 'actions'];
	displayedSubjectColumns: string[] = ['select', 'name', 'code', 'academyName', 'actions'];
	displayedAcademyColumns: string[] = ['select', 'name', 'abbreviation', 'actions'];

	constructor(private router: Router, private examService: ExamService, private courseService: CourseService,
		private subjectService: SubjectService, private academyService: AcademyService, private dialog: MatDialog) { }

	ngOnInit() {
		this.examService.getUnpublishedExams().subscribe(responseExams => {
			//	this.exams = responseExams;
			for (let exam of responseExams) {
				let temp = new CustomExam();
				temp.id = exam.id;
				temp.filename = exam.filename;
				temp.date = exam.date;
				temp.unpublishDate = exam.unpublishDate;

				this.courseService.getCourseById(exam.courseId).subscribe(responseCourse => {
					temp.courseName = responseCourse.name;
				});
				this.examArray.push(temp);
			}
		});

		this.courseService.getUnpublishedCourses().subscribe(responseCourses => {
			this.courses = responseCourses;
			for (let course of this.courses) {
				let temp = new CustomCourse();
				temp.id = course.id;
				temp.name = course.name;
				temp.courseCode = course.courseCode;
				temp.subjectId = course.subjectId;

				this.subjectService.getSubjectById(course.subjectId).subscribe(responseSubject => {
					temp.subjectName = responseSubject.name;
				});
				this.courseArray.push(temp);
			}
		});

		this.subjectService.getUnpublishedSubjects().subscribe(responseSubjects => {
			this.subjects = responseSubjects;
			for (let subject of this.subjects) {
				let temp = new CustomSubject();
				temp.id = subject.id;
				temp.name = subject.name;
				temp.code = subject.code;

				this.academyService.getAcademyById(subject.academyId).subscribe(responseAcademy => {
					temp.academyName = responseAcademy.name;
				});
				this.subjectArray.push(temp);
			}
		});

		this.academyService.getUnpublishedAcademies().subscribe(responseAcademies => {
			this.academies = responseAcademies;
			this.academyArray = this.academies;
		});
	}


	publishExam(element: any) {
		this.examService.publishExam(element);
		this.examArray = this.examArray.filter(x => x.id != element.id);
	}

	publishCourses() {
		for (let customCourse of this.courseSelection.selected) {
			let course = new Course();
			course.id = customCourse.id;
			course.name = customCourse.name;
			course.courseCode = customCourse.courseCode;
			course.subjectId = customCourse.subjectId;
			course.unpublished = false;

			this.courseService.saveCourse(course);
			this.courseArray = this.courseArray.filter(x => x.id != course.id);
		}
	}


	openExamDeleteDialog() {

		let amountSelected = this.examSelection.selected.length;

		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.titleMessage = "Removing checked!";
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete " + amountSelected + " user(s)?";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";

		this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				for (let exam of this.examSelection.selected) {
					this.examService.deleteExam(exam.id);
					this.examArray = this.examArray.filter(x => x.id != exam.id);
				}
			}
			this.dialogRef = null;
		});
	}

	openDialog(duty: string, type: string) {
		let amountSelected = this.courseSelection.selected.length;
		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.titleMessage = "confirm";
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to " + duty + " " + amountSelected + " " + type +"(s)?";
		this.dialogRef.componentInstance.confirmBtnText = duty;

		this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (duty == "publish") {
					switch (type) {
						case "course":
							this.publishCourses();
	
					}
				}
				
			}
			this.dialogRef = null;
		});
	}



	isAllExamsSelected() {
		const numSelected = this.examSelection.selected.length;
		const numRows = this.examArray.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterExamToggle() {
		this.isAllExamsSelected() ? this.examSelection.clear() : this.examArray.forEach(row => this.examSelection.select(row));
	}

	isAllCoursesSelected() {
		const numSelected = this.courseSelection.selected.length;
		const numRows = this.courseArray.length;
		return numSelected === numRows;
	}

	masterCourseToggle() {
		this.isAllCoursesSelected() ? this.courseSelection.clear() : this.courseArray.forEach(row => this.courseSelection.select(row));
	}

	isAllSubjectsSelected() {
		const numSelected = this.subjectSelection.selected.length;
		const numRows = this.subjectArray.length;
		return numSelected === numRows;
	}

	masterSubjectToggle() {
		this.isAllSubjectsSelected() ? this.subjectSelection.clear() : this.subjectArray.forEach(row => this.subjectSelection.select(row));
	}

	isAllAcademiesSelected() {
		const numSelected = this.academySelection.selected.length;
		const numRows = this.academyArray.length;
		return numSelected === numRows;
	}

	masterAcademyToggle() {
		this.isAllAcademiesSelected() ? this.academySelection.clear() : this.academyArray.forEach(row => this.academySelection.select(row));
	}

	toggleExamTable() {
		this.showExams = !this.showExams;
	}

	toggleCourseTable() {
		this.showCourses = !this.showCourses;
	}

	toggleSubjectTable() {
		this.showSubjects = !this.showSubjects;
	}

	toggleAcademyTable() {
		this.showAcademies = !this.showAcademies;
	}
}