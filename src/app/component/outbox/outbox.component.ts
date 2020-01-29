
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { faFileMedical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExamService } from '../../service/exam.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CourseService } from 'src/app/service/course.service';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Exam } from 'src/app/model/exam.model';
import { Course } from 'src/app/model/course.model';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';

import { UnpublishService } from '../../service/unpublish.service';
import { StatusMessageService } from 'src/app/service/status-message.service';

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

export class CustomAcademy {
	id: number;
	name: string;
	abbreviation: string;
}

@Component({
	selector: 'app-outbox',
	templateUrl: './outbox.component.html',
	styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	faFileMedical = faFileMedical;
	faTrash = faTrash;

	exams: Array<CustomExam> = [];
	courses: Array<CustomCourse> = [];
	subjects: Array<CustomSubject> = [];
	academies: Array<CustomAcademy> = [];

	showExams = false;
	showCourses = false;
	showSubjects = false;
	showAcademies = false;

	examSelection = new SelectionModel<CustomExam>(true, []);
	courseSelection = new SelectionModel<CustomCourse>(true, []);
	subjectSelection = new SelectionModel<CustomSubject>(true, []);
	academySelection = new SelectionModel<CustomAcademy>(true, []);

	isSelectionButtonsDisabled = true;

	clickedId: number;

	displayedExamColumns: string[] = ['select', 'filename', 'date', 'unpublishDate', 'courseName', 'actions'];
	displayedCourseColumns: string[] = ['select', 'name', 'courseCode', 'subjectName', 'actions'];
	displayedSubjectColumns: string[] = ['select', 'name', 'code', 'academyName', 'actions'];
	displayedAcademyColumns: string[] = ['select', 'name', 'abbreviation', 'actions'];

	constructor(
		private router: Router, 
		private examService: ExamService, 
		private courseService: CourseService,
		private subjectService: SubjectService, 
		private academyService: AcademyService, 
		private dialog: MatDialog) { }

	ngOnInit() {
		let sub: any;

		sub = this.examService.getUnpublishedExams().subscribe(responseExams => {
			for (let exam of responseExams) {
				let customExam = this.examConverter(exam);
				this.exams.push(customExam);
			}
		});
		this.subscriptions.add(sub);

		sub = this.courseService.getUnpublishedCourses().subscribe(responseCourses => {
			for (let course of responseCourses) {
				let customCourse = this.courseConverter(course);
				this.courses.push(customCourse);
			}
		});
		this.subscriptions.add(sub);

		sub = this.subjectService.getUnpublishedSubjects().subscribe(responseSubjects => {
			for (let subject of responseSubjects) {
				let customSubject = this.subjectConverter(subject);
				this.subjects.push(customSubject);
			}
		});
		this.subscriptions.add(sub);

		sub = this.academyService.getUnpublishedAcademies().subscribe(responseAcademies => {
			for (let academy of responseAcademies) {
				let customAcademy = this.academyConverter(academy);
				this.academies.push(customAcademy);
			}
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
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
			const sub = this.academyService.getAcademyById(input.academyId).subscribe(responseAcademy => {
				output.academyName = responseAcademy.name;
			});
			this.subscriptions.add(sub);
		}
		output.id = input.id;
		output.name = input.name;
		output.code = input.code;
		output.academyId = input.academyId;
		return output;
	}

	academyConverter(input: any) {
		let output;

		if (input instanceof CustomAcademy) {
			output = new Academy();
		} else {
			output = new CustomAcademy();
		}
		output.id = input.id;
		output.name = input.name;
		output.abbreviation = input.abbreviation;
		return output;
	}

	selectionDialogText(examAmount: number, courseAmount: number, subjectAmount: number, academyAmount: number, service: string) {

		let contentText = (examAmount !== 0) ? "\n" + examAmount + (examAmount == 1 ? " exam" : " exams") : "";
		contentText = contentText.concat((courseAmount !== 0) ? "\n" + courseAmount + (courseAmount == 1 ? " course" : " courses") : "");
		contentText = contentText.concat((subjectAmount !== 0) ? "\n" + subjectAmount + (subjectAmount == 1 ? " subject" : " subjects") : "");
		contentText = contentText.concat((academyAmount !== 0) ? "\n" + academyAmount + (academyAmount == 1 ? " academy" : " academies") : "");

		let serviceText = (contentText.length !== 0) ? "Are you sure you want to " + service + "\n": "";
		return serviceText = serviceText.concat(contentText);
	}

	openSelectionDialog(service: string) {
		let amountExamsSelected = this.examSelection.selected.length;
		let amountCoursesSelected = this.courseSelection.selected.length;
		let amountSubjectsSelected = this.subjectSelection.selected.length;
		let amountAcademiesSelected = this.academySelection.selected.length;
			
		let serviceText = this.selectionDialogText(amountExamsSelected, amountCoursesSelected, amountSubjectsSelected, amountAcademiesSelected, service);

		if (amountExamsSelected !== 0 || amountCoursesSelected !== 0 || amountSubjectsSelected !== 0 || amountAcademiesSelected !== 0){
			this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
			});
			this.dialogRef.componentInstance.titleMessage = "confirm";
			this.dialogRef.componentInstance.contentMessage = serviceText;
			this.dialogRef.componentInstance.confirmBtnText = service;
			
			const sub = this.dialogRef.afterClosed().subscribe(result => {
				if (result) {
					if (service == "publish") {
						(amountExamsSelected !== 0) ? this.publishExams() : null;
						(amountCoursesSelected !== 0) ? this.publishCourses() : null;
						(amountSubjectsSelected !== 0) ? this.publishSubjects() : null;
						(amountAcademiesSelected !== 0) ? this.publishAcademies() : null;
						
					} else if (service == "delete"){
						(amountExamsSelected !== 0) ? this.deleteExams() : null;
						(amountCoursesSelected !== 0) ? this.deleteCourses() : null;
						(amountSubjectsSelected !== 0) ? this.deleteSubjects() : null;
						(amountAcademiesSelected !== 0) ? this.deleteAcademies() : null;
					} 
					this.clearSelections();
				}
				this.dialogRef = null;
			});
			this.subscriptions.add(sub);
		}
	}

	openSingleElementDialog(element: any, service: string) {
		let content: string = "Are you sure you want to " + service + " this ";
		if (element instanceof CustomExam) {
			content = content.concat("exam?\n\n" + element.filename);
		} else if (element instanceof CustomCourse) {
			content = content.concat("course?\n\n" + element.name);
		} else if (element instanceof CustomSubject) {
			content = content.concat("subject?\n\n" + element.name);
		}else if (element instanceof CustomAcademy) {
			content = content.concat("academy?\n\n" + element.name);
		}

		this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
		});
		this.dialogRef.componentInstance.titleMessage = "confirm";
		this.dialogRef.componentInstance.contentMessage = content;
		this.dialogRef.componentInstance.confirmBtnText = service;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (service == "publish") {
					(element instanceof CustomExam) ? this.publishExam(element) : null;
					(element instanceof CustomCourse) ? this.publishCourse(element) : null;
					(element instanceof CustomSubject) ? this.publishSubject(element) : null;
					(element instanceof CustomAcademy) ? this.publishAcademy(element) : null;
				} else if (service == "delete") {
					(element instanceof CustomExam) ? this.deleteExam(element) : null;
					(element instanceof CustomCourse) ? this.deleteCourse(element) : null;
					(element instanceof CustomSubject) ? this.deleteSubject(element) : null;
					(element instanceof CustomAcademy) ? this.deleteAcademy(element) : null;
				}
				this.clearSelections();
			}
			this.dialogRef = null;
		}); 
		this.subscriptions.add(sub);
	}

	publishExam(element: CustomExam) {
		let exam = this.examConverter(element);
		this.examService.publishExam(exam).subscribe(data => {
		});
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
		const sub = this.courseService.publishCourse(course).subscribe();
		this.subscriptions.add(sub);
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
		const sub = this.subjectService.publishSubject(subject).subscribe();
		this.subscriptions.add(sub);
		this.subjects = this.subjects.filter(x => x.id != subject.id); 
	}
	
	publishSubjects() {
		for (let customSubject of this.subjectSelection.selected) {
			this.publishSubject(customSubject);
		}
	}

	publishAcademy(element: CustomAcademy) {
		let academy = this.academyConverter(element);
		academy.unpublished = false;
		const sub = this.academyService.unpublishAcademy(academy).subscribe();
		this.subscriptions.add(sub);
		this.academies = this.academies.filter(x => x.id != academy.id); 
	}
	
	publishAcademies() {
		for (let customAcademy of this.academySelection.selected) {
			this.publishAcademy(customAcademy);
		}
	}

	deleteExam(element: CustomExam) {
		const sub = this.examService.deleteExam(element.id).subscribe();
		this.subscriptions.add(sub);
		this.exams = this.exams.filter(x => x.id != element.id);
	}

	deleteExams() {
		let exams: Exam[] = [];
		for (let customExam of this.examSelection.selected) {
			exams.push(this.examConverter(customExam));
			this.exams = this.exams.filter(x => x.id != customExam.id);
		}
		const sub = this.examService.deleteExams(exams).subscribe();
		this.subscriptions.add(sub);
	}

	deleteCourse(element: CustomCourse) {
		const sub = this.courseService.deleteCourse(element.id).subscribe();
		this.subscriptions.add(sub);
		this.courses = this.courses.filter(x => x.id != element.id);
	}
	
	deleteCourses() {
		let courses: Course[] = [];
		for (let customCourse of this.courseSelection.selected) {
			courses.push(this.courseConverter(customCourse));
			this.courses = this.courses.filter(x => x.id != customCourse.id);
		}
		const sub = this.courseService.deleteCourses(courses).subscribe();
		this.subscriptions.add(sub);
	}

	deleteSubject(element: CustomSubject) {
		const sub = this.subjectService.deleteSubject(element.id).subscribe();
		this.subscriptions.add(sub);
		this.subjects = this.subjects.filter(x => x.id != element.id);
	}
	
	deleteSubjects() {
		let subjects: Subject[] = [];
		for (let customSubject of this.subjectSelection.selected) {
			subjects.push(this.courseConverter(customSubject));
			this.courses = this.courses.filter(x => x.id != customSubject.id);
		}
		const sub = this.subjectService.deleteSubjects(subjects).subscribe();
		this.subscriptions.add(sub);
	}

	deleteAcademy(element: CustomAcademy) {
		const sub = this.academyService.deleteAcademy(element.id).subscribe();
		this.subscriptions.add(sub);
		this.academies = this.academies.filter(x => x.id != element.id);
	}
	
	deleteAcademies() {
		let academies : Academy[] = [];
		for (let customAcademy of this.academySelection.selected) {
			academies.push(this.courseConverter(CustomAcademy));
			this.courses = this.courses.filter(x => x.id != customAcademy.id);
		}
		const sub = this.academyService.deleteAcademies(academies).subscribe();
		this.subscriptions.add(sub);
	}

	isAllExamsSelected() {
		const numSelected = this.examSelection.selected.length;
		const numRows = this.exams.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterExamToggle() {
		this.isAllExamsSelected() ? this.examSelection.clear() : this.exams.forEach(row => this.examSelection.select(row));
		this.isAnyCheckboxSelected();
	}

	isAllCoursesSelected() {
		const numSelected = this.courseSelection.selected.length;
		const numRows = this.courses.length;
		return numSelected === numRows;
	}

	masterCourseToggle() {
		this.isAllCoursesSelected() ? this.courseSelection.clear() : this.courses.forEach(row => this.courseSelection.select(row));
		this.isAnyCheckboxSelected();
	}

	isAllSubjectsSelected() {
		const numSelected = this.subjectSelection.selected.length;
		const numRows = this.subjects.length;
		return numSelected === numRows;
	}

	masterSubjectToggle() {
		this.isAllSubjectsSelected() ? this.subjectSelection.clear() : this.subjects.forEach(row => this.subjectSelection.select(row));
		this.isAnyCheckboxSelected();
	}

	isAllAcademiesSelected() {
		const numSelected = this.academySelection.selected.length;
		const numRows = this.academies.length;
		return numSelected === numRows;
	}

	masterAcademyToggle() {
		this.isAllAcademiesSelected() ? this.academySelection.clear() : this.academies.forEach(row => this.academySelection.select(row));
		this.isAnyCheckboxSelected();
	}

	isAnyCheckboxSelected() {
		(this.examSelection.selected.length !== 0 || this.courseSelection.selected.length !== 0 || this.subjectSelection.selected.length !== 0 
			|| this.academySelection.selected.length !== 0) ? this.isSelectionButtonsDisabled = false : this.isSelectionButtonsDisabled = true;
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

	clearSelections() {
		this.examSelection.clear();
		this.courseSelection.clear();
		this.subjectSelection.clear();
		this.academySelection.clear();
	}
}
