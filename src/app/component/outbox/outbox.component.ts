
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

	exams: Exam[] = [];
	courses = [];
	subjects = [];
	academies = [];

	showExams = false;
	showCourses = false;
	showSubjects = false;
	showAcademies = false;

	selection = new SelectionModel<Exam>(true, []);

	clickedId: number;
	displayedExamColumns: string[] = ['select', 'filename', 'date', 'unpublishDate', 'courseName', 'actions'];
	displayedCourseColumns: string[] = ['select', 'name', 'courseCode', 'subjectName', 'actions'];
	displayedSubjectColumns: string[] = ['select', 'name', 'code', 'academyName', 'actions'];
	displayedAcademyColumns: string[] = ['select', 'name', 'abbreviation', 'actions'];

	constructor(private router: Router, private examService: ExamService, private courseService: CourseService,
		private subjectService: SubjectService, private academyService: AcademyService, private dialog: MatDialog) { }

	ngOnInit() {
		this.examService.getUnpublishedExams().subscribe(responseExams => {
			this.exams = responseExams;
			for (let exam of this.exams) {
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
			console.log(this.examArray);
			
		});

		this.courseService.getUnpublishedCourses().subscribe(responseCourses => {
			this.courses = responseCourses;
			for (let course of this.courses) {
				let temp = new CustomCourse();
				temp.id = course.id;
				temp.name = course.name;
				temp.courseCode = course.courseCode;

				this.subjectService.getSubjectById(course.subjetId).subscribe(responseSubject => {
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

				this.subjectService.getSubjectById(subject.subjetId).subscribe(responseAcademy => {
					temp.academyName = responseAcademy.name;
				});
				this.subjectArray.push(temp);
			}
		});

		this.academyService.getUnpublishedAcademies().subscribe(responseAcademies => {
			this.academyArray = responseAcademies;
		});

	}


	publishExam(element: any) {
		this.examService.publishExam(element);
		this.exams = this.exams.filter(x => x.id != element.id);
	}

	openDeleteDialog(element: any) {
		this.clickedId = element.id;
		this.dialogRef = this.dialog.open(ConfirmationDialog, {
		});
		this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";

		this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.examService.deleteExam(this.clickedId);
				this.exams = this.exams.filter(x => x.id != this.clickedId);
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

	toggleExamTable() {
		this.showExams = !this.showExams;
		/*
				if (this.showExams) {
					this.showExams = false;
					this.changeDetector.detectChanges();
				} else {
					this.showExams = true;
					this.changeDetector.detectChanges();
				} */
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