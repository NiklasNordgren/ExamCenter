
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
	courseId: number;
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
	academyId: number;
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

	exams: Array<CustomExam> = [];
	courses: Array<CustomCourse> = [];
	subjects: Array<CustomSubject> = [];
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
			for (let exam of responseExams) {
				let customExam = this.examConverter(exam);
				this.exams.push(customExam);
			}
		});

		this.courseService.getUnpublishedCourses().subscribe(responseCourses => {
			for (let course of responseCourses) {
				let customCourse = this.courseConverter(course);
				this.courses.push(customCourse);
			}
		});

		this.subjectService.getUnpublishedSubjects().subscribe(responseSubjects => {
			for (let subject of responseSubjects) {
				let customSubject = this.subjectConverter(subject);
				this.subjects.push(customSubject);
			}
		});

		this.academyService.getUnpublishedAcademies().subscribe(responseAcademies => {
			this.academies = responseAcademies;
		});
	}

	examConverter(input: any) {
		let output;

		if (input instanceof CustomExam) {
			output = new Exam();
		} else {
			output = new CustomExam();
			this.courseService.getCourseById(input.courseId).subscribe(responseCourse => {
				output.courseName = responseCourse.name;
			});
		}
		output.id = input.id;
		output.filename = input.filename;
		output.date = input.date;
		output.unpublishDate = input.unpublishDate;
		output.courseId = input.courseId;
		return output;
	}

	courseConverter(input: any) {
		let output;

		if (input instanceof CustomCourse) {
			output = new Course();
		} else {
			output = new CustomCourse();
			this.subjectService.getSubjectById(input.subjectId).subscribe(responseSubject => {
				output.subjectName = responseSubject.name;
			});
		}
		output.id = input.id;
		output.name = input.name;
		output.courseCode = input.courseCode;
		output.subjectId = input.subjectId;
		return output;
	}

	subjectConverter(input: any) {
		let output;

		if (input instanceof CustomSubject) {
			output = new Subject();
		} else {
			output = new CustomSubject();
			this.academyService.getAcademyById(input.academyId).subscribe(responseAcademy => {
				output.academyName = responseAcademy.name;
			});
		}
		output.id = input.id;
		output.name = input.name;
		output.code = input.code;
		output.academyId = input.academyId;
		return output;
	}

	dialogText(examAmount: number, courseAmount: number, subjectAmount: number, academyAmount: number, duty: string) {

		let contentText = (examAmount !== 0) ? "\n" + examAmount + (examAmount == 1 ? " exam" : " exams") : "";
		contentText = contentText.concat((courseAmount !== 0) ? "\n" + courseAmount + (courseAmount == 1 ? " course" : " courses") : "");
		contentText = contentText.concat((subjectAmount !== 0) ? "\n" + subjectAmount + (subjectAmount == 1 ? " subject" : " subjects") : "");
		contentText = contentText.concat((academyAmount !== 0) ? "\n" + academyAmount + (academyAmount == 1 ? " academey" : " academies") : "");

		let dutyText = (contentText.length !== 0) ? "Are you sure you want to " + duty: "";
		return dutyText = dutyText.concat(contentText);
	}

	openDialog(duty: string) {
		let amountExamsSelected = this.examSelection.selected.length;
		let amountCoursesSelected = this.courseSelection.selected.length;
		let amountSubjectsSelected = this.subjectSelection.selected.length;
		let amountAcademiesSelected = this.academySelection.selected.length;
			
		let dutyText = this.dialogText(amountExamsSelected, amountCoursesSelected, amountSubjectsSelected, amountAcademiesSelected, duty);

		if (amountExamsSelected !== 0 || amountCoursesSelected !== 0 || amountSubjectsSelected !== 0 || amountAcademiesSelected !== 0){
			this.dialogRef = this.dialog.open(ConfirmationDialog, {
			});
			this.dialogRef.componentInstance.titleMessage = "confirm";
			this.dialogRef.componentInstance.contentMessage = dutyText;
			this.dialogRef.componentInstance.confirmBtnText = duty;
	
			this.dialogRef.afterClosed().subscribe(result => {
				if (result) {
					if (duty == "publish") {
						(amountExamsSelected !== 0) ? this.publishExams() : "";
						(amountCoursesSelected !== 0) ? this.publishCourses() : "";
						(amountSubjectsSelected !== 0) ? this.publishSubjects() : "";
						(amountAcademiesSelected !== 0) ? this.publishAcademies() : "";
						
					} else if (duty == "delete"){
						(amountExamsSelected !== 0) ? this.deleteExams() : "";
						(amountCoursesSelected !== 0) ? this.deleteCourses() : "";
						(amountSubjectsSelected !== 0) ? this.deleteSubjects() : "";
						(amountAcademiesSelected !== 0) ? this.deleteAcademies() : "";
					} 
				}
				this.dialogRef = null;
			});
		} else {
			console.log("No selected");
			
		}
		
	}

	publishExam(element: CustomExam) {
		let exam = this.examConverter(element);
		this.examService.publishExam(exam);
		this.exams = this.exams.filter(x => x.id != exam.id);
	}

	publishExams() {
		for (let customExam of this.examSelection.selected) {
			this.publishExam(customExam);
		}
	}

	publishCourse(element: CustomCourse) {
		let course = this.courseConverter(element);
		course.unpublished = false;
		this.courseService.publishCourse(course);
		this.courses = this.courses.filter(x => x.id != course.id); 
	}

	publishCourses() {
		for (let customCourse of this.courseSelection.selected) {
			this.publishCourse(customCourse);
		}
	}

	publishSubject(element: CustomSubject) {
		let subject = this.subjectConverter(element);
		subject.unpublished = false;
		this.subjectService.publishSubject(subject);
		this.subjects = this.subjects.filter(x => x.id != subject.id); 
	}
	
	publishSubjects() {
		for (let customSubject of this.subjectSelection.selected) {
			this.publishSubject(customSubject);
		}
	}

	publishAcademy(element: Academy) {
		element.unpublished = false;
		this.academyService.unpublishAcademy(element);
		this.academies = this.academies.filter(x => x.id != element.id); 
	}
	
	publishAcademies() {
		for (let customAcademy of this.academySelection.selected) {
			this.publishAcademy(customAcademy);
		}
	}

	deleteExam(element: CustomExam) {
		this.examService.deleteExam(element.id);
		this.exams = this.exams.filter(x => x.id != element.id);
	}

	deleteExams() {
		for (let customExam of this.examSelection.selected) {
			this.deleteExam(customExam);
		}
	}

	deleteCourse(element: CustomCourse) {
		this.courseService.deleteCourse(element.id);
		this.courses = this.courses.filter(x => x.id != element.id);
	}
	
	deleteCourses() {
		for (let customCourse of this.courseSelection.selected) {
			this.deleteCourse(customCourse);
		}
	}

	deleteSubject(element: CustomSubject) {
		this.subjectService.deleteSubject(element.id);
		this.subjects = this.subjects.filter(x => x.id != element.id);
	}
	
	deleteSubjects() {
		for (let customSubject of this.subjectSelection.selected) {
			this.deleteSubject(customSubject);
		}
	}

	deleteAcademie(element: Academy) {
		this.academyService.deleteAcademy(element.id);
		this.academies = this.academies.filter(x => x.id != element.id);
	}
	
	deleteAcademies() {
		for (let customAcademie of this.academySelection.selected) {
			this.deleteAcademie(customAcademie);
		}
	}

	isAllExamsSelected() {
		const numSelected = this.examSelection.selected.length;
		const numRows = this.exams.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterExamToggle() {
		this.isAllExamsSelected() ? this.examSelection.clear() : this.exams.forEach(row => this.examSelection.select(row));
	}

	isAllCoursesSelected() {
		const numSelected = this.courseSelection.selected.length;
		const numRows = this.courses.length;
		return numSelected === numRows;
	}

	masterCourseToggle() {
		this.isAllCoursesSelected() ? this.courseSelection.clear() : this.courses.forEach(row => this.courseSelection.select(row));
	}

	isAllSubjectsSelected() {
		const numSelected = this.subjectSelection.selected.length;
		const numRows = this.subjects.length;
		return numSelected === numRows;
	}

	masterSubjectToggle() {
		this.isAllSubjectsSelected() ? this.subjectSelection.clear() : this.subjects.forEach(row => this.subjectSelection.select(row));
	}

	isAllAcademiesSelected() {
		const numSelected = this.academySelection.selected.length;
		const numRows = this.academies.length;
		return numSelected === numRows;
	}

	masterAcademyToggle() {
		this.isAllAcademiesSelected() ? this.academySelection.clear() : this.academies.forEach(row => this.academySelection.select(row));
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