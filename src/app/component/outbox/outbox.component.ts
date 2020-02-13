
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { faFileMedical, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExamService } from '../../service/exam.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Sort, MatTable } from '@angular/material';
import { Navigator } from 'src/app/util/navigator';
import { CourseService } from 'src/app/service/course.service';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Exam } from 'src/app/model/exam.model';
import { Course } from 'src/app/model/course.model';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';

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
	styleUrls: ['./outbox.component.scss'],
	providers: [Navigator]
})
export class OutboxComponent implements OnInit, OnDestroy {
	@ViewChild(MatTable, { static: false }) examTable: MatTable<Exam>;
	@ViewChild(MatTable, { static: false }) courseTable: MatTable<Course>;
	@ViewChild(MatTable, { static: false }) subjectTable: MatTable<Subject>;
	@ViewChild(MatTable, { static: false }) academyTable: MatTable<Academy>;

	subscriptions: Subscription = new Subscription();
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	faFileMedical = faFileMedical;
	faPen = faPen;
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
		private examService: ExamService,
		private courseService: CourseService,
		private subjectService: SubjectService,
		private academyService: AcademyService,
		private dialog: MatDialog,
		public navigator: Navigator,
		private statusMessageService: StatusMessageService) { }

	ngOnInit() {
		this.getAcademies();
		this.getSubjects();
		this.getCourses();
		this.getExams();
	}

	getAcademies() {
		this.subscriptions.add(
			this.academyService.getUnpublishedAcademies().subscribe(responseAcademies => {
				this.academies = [];
				for (let academy of responseAcademies) {
					let customAcademy = this.academyConverter(academy);
					this.academies.push(customAcademy);
				}
			})
		);
	}

	getSubjects() {
		this.subscriptions.add(
			this.subjectService.getUnpublishedSubjects().subscribe(responseSubjects => {
				this.subjects = [];
				for (let subject of responseSubjects) {
					let customSubject = this.subjectConverter(subject);
					this.subjects.push(customSubject);
				}
			})
		);
	}

	getCourses() {
		this.subscriptions.add(
			this.courseService.getUnpublishedCourses().subscribe(responseCourses => {
				this.courses = [];
				for (let course of responseCourses) {
					let customCourse = this.courseConverter(course);
					this.courses.push(customCourse);
				}
			})
		);
	}

	getExams() {
		this.subscriptions.add(
			this.examService.getUnpublishedExams().subscribe(responseExams => {
				this.exams = [];
				for (let exam of responseExams) {
					let customExam = this.examConverter(exam);
					this.exams.push(customExam);
				}
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	examConverter(input: any) {
		let output: any;

		if (input instanceof CustomExam) {
			output = new Exam();
		} else {
			output = new CustomExam();
			this.subscriptions.add(
				this.courseService.getCourseById(input.courseId).subscribe(responseCourse => {
					output.courseName = responseCourse.name;
				}));
		}
		output.id = input.id;
		output.filename = input.filename;
		output.date = input.date;
		output.unpublishDate = input.unpublishDate;
		output.courseId = input.courseId;
		return output;
	}

	courseConverter(input: any) {
		let output: any;

		if (input instanceof CustomCourse) {
			output = new Course();
		} else {
			output = new CustomCourse();
			this.subscriptions.add(
				this.subjectService.getSubjectById(input.subjectId).subscribe(responseSubject => {
					output.subjectName = responseSubject.name;
				}));
		}
		output.id = input.id;
		output.name = input.name;
		output.courseCode = input.courseCode;
		output.subjectId = input.subjectId;
		return output;
	}

	subjectConverter(input: any) {
		let output: any;

		if (input instanceof CustomSubject) {
			output = new Subject();
		} else {
			output = new CustomSubject();
			this.subscriptions.add(
				this.academyService.getAcademyById(input.academyId).subscribe(responseAcademy => {
					output.academyName = responseAcademy.name;
				}));
		}
		output.id = input.id;
		output.name = input.name;
		output.code = input.code;
		output.academyId = input.academyId;
		return output;
	}

	academyConverter(input: any) {
		let output: any;

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

	convertToDate(date : Array<number>){
		if(date.length >= 3)
			return date[0] + '-' + date[1] + '-' + date[2];
		else
			return 'No date avalible';
	}

	selectionDialogText(examAmount: number, courseAmount: number, subjectAmount: number, academyAmount: number, service: string) {

		let contentText = (examAmount !== 0) ? "\n" + examAmount + (examAmount == 1 ? " exam" : " exams") : "";
		contentText = contentText.concat((courseAmount !== 0) ? "\n" + courseAmount + (courseAmount == 1 ? " course" : " courses") : "");
		contentText = contentText.concat((subjectAmount !== 0) ? "\n" + subjectAmount + (subjectAmount == 1 ? " subject" : " subjects") : "");
		contentText = contentText.concat((academyAmount !== 0) ? "\n" + academyAmount + (academyAmount == 1 ? " faculty" : " faculties") : "");

		let serviceText = (contentText.length !== 0) ? "Are you sure you want to " + service + "\n" : "";
		return serviceText = serviceText.concat(contentText);
	}

	openSelectionDialog(service: string) {
		let amountExamsSelected = this.examSelection.selected.length;
		let amountCoursesSelected = this.courseSelection.selected.length;
		let amountSubjectsSelected = this.subjectSelection.selected.length;
		let amountAcademiesSelected = this.academySelection.selected.length;

		let serviceText = this.selectionDialogText(amountExamsSelected, amountCoursesSelected, amountSubjectsSelected, amountAcademiesSelected, service);

		if (amountExamsSelected !== 0 || amountCoursesSelected !== 0 || amountSubjectsSelected !== 0 || amountAcademiesSelected !== 0) {
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

					} else if (service == "delete") {
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
		} else if (element instanceof CustomAcademy) {
			content = content.concat("faculty?\n\n" + element.name);
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
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	publishExam(element: CustomExam) {
		let exam = this.examConverter(element);
		if (!this.isParentUnpublished(this.courses, exam.subjectId)) {
			this.subscriptions.add(
				this.examService.publishExam(exam).subscribe(
					res => {
						this.exams = this.exams.filter(x => x.id != exam.id);
						this.examSelection.clear();
						this.statusMessageService.showSuccessMessage(exam.filename + " got published.");
					},
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err)
				));
		} else {
			this.statusMessageService.showErrorMessage("Course not published", "The course this exam belongs to is unpublished. \n" +
				"Please publish the course if you want this published.");
		}
	}

	publishExams() {
		const isUnpublished = false;
		let exams: Exam[] = [];
		let errorExams: CustomExam[] = [];
		for (let customExam of this.examSelection.selected) {
			if (!this.isParentUnpublished(this.courses, customExam.courseId)) {
				exams.push(this.examConverter(customExam));
				this.exams = this.exams.filter(x => x.id != customExam.id);
			} else {
				errorExams.push(customExam);
			}
		}
		if (exams.length > 0) {
			this.subscriptions.add(
				this.examService.publishExams(exams, isUnpublished).subscribe(
					res => this.examSelection.clear(),
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err)
				));
		}
		if (errorExams.length > 0) {
			let courseNoun = "course";
			let lastCourseName = "";
			let examMessagePart = "";
			errorExams.forEach(exam => {
				(courseNoun == "courses" || lastCourseName.length == 0) ? lastCourseName = exam.courseName
					: (lastCourseName != exam.courseName) ? courseNoun = "courses" : null

				examMessagePart = examMessagePart + exam.filename + " of " + exam.courseName + "\n";
			});
			const examOrExams = (errorExams.length == 1) ? "exam" : "exams";
			this.makeAndShowErrorMessage(errorExams, examOrExams, courseNoun, examMessagePart);
		}
	}

	publishCourse(element: CustomCourse) {
		let course = this.courseConverter(element);
		if (!this.isParentUnpublished(this.subjects, course.subjectId)) {
			course.unpublished = false;
			this.subscriptions.add(
				this.courseService.publishCourse(course).subscribe(
					res => {
						this.courses = this.courses.filter(x => x.id != course.id);
						this.courseSelection.clear();
						this.statusMessageService.showSuccessMessage(course.name + " got published.");
					},
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
					() => this.getExams()
				)
			);
		} else {
			this.statusMessageService.showErrorMessage("Subject not published", "The subject this course belongs to is unpublished. \n" +
				"Please publish the subject if you want this published.");
		}
	}

	publishCourses() {
		const isUnpublished = false;
		let courses: Course[] = [];
		let errorCourses: CustomCourse[] = [];
		for (let customCourse of this.courseSelection.selected) {
			if (!this.isParentUnpublished(this.subjects, customCourse.subjectId)) {
				courses.push(this.courseConverter(customCourse));
				this.courses = this.courses.filter(x => x.id != customCourse.id);
			} else {
				errorCourses.push(customCourse);
			}
		}
		if (courses.length > 0) {
			this.subscriptions.add(
				this.courseService.publishCourses(courses, isUnpublished).subscribe(
					res => this.courseSelection.clear(),
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
					() => this.getExams()
				)
			);
		}
		if (errorCourses.length > 0) {
			let subjectNoun = "subject";
			let lastSubjectName = "";
			let courseMessagePart = "";
			errorCourses.forEach(course => {
				(subjectNoun == "subjects" || lastSubjectName.length == 0) ? lastSubjectName = course.subjectName
					: (lastSubjectName != course.subjectName) ? subjectNoun = "subjects" : null

				courseMessagePart = courseMessagePart + course.name + " of " + course.subjectName + "\n";
			});
			const courseOrCourses = (errorCourses.length == 1) ? "course" : "courses";
			this.makeAndShowErrorMessage(errorCourses, courseOrCourses, subjectNoun, courseMessagePart);
		}
	}

	publishSubject(element: CustomSubject) {
		let subject = this.subjectConverter(element);
		if (!this.isParentUnpublished(this.academies, subject.academyId)) {
			subject.unpublished = false;
			this.subscriptions.add(
				this.subjectService.publishSubject(subject).subscribe(
					res => {
						this.subjects = this.subjects.filter(x => x.id != subject.id);
						this.subjectSelection.clear();
						this.statusMessageService.showSuccessMessage(subject.name + " got published.");
					},
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
					() => {
						this.getCourses()
						this.getExams()
					}
				)
			);
		} else {
			this.statusMessageService.showErrorMessage("Faculty not published", "The faculty this subject belongs to is unpublished. \n" +
				"Please publish the faculty if you want this published.");
		}
	}

	publishSubjects() {
		const isUnpublished = false;
		let subjects: Subject[] = [];
		let errorSubjects: CustomSubject[] = [];
		for (let customSubject of this.subjectSelection.selected) {
			if (!this.isParentUnpublished(this.academies, customSubject.academyId)) {
				subjects.push(this.subjectConverter(customSubject));
				this.subjects = this.subjects.filter(x => x.id != customSubject.id);
			} else {
				errorSubjects.push(customSubject);
			}
		}
		if (subjects.length > 0) {
			this.subscriptions.add(
				this.subjectService.publishSubjects(subjects, isUnpublished).subscribe(
					res => this.subjectSelection.clear(),
					err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
					() => {
						this.getCourses()
						this.getExams()
					}
				)
			);
		}
		if (errorSubjects.length > 0) {
			let academyNoun = "faculty";
			let lastAcademyName = "";
			let subjectMessagePart = "";
			errorSubjects.forEach(subject => {
				(academyNoun == "subjects" || lastAcademyName.length == 0) ? lastAcademyName = subject.academyName
					: (lastAcademyName != subject.academyName) ? academyNoun = "faculties" : null

				subjectMessagePart = subjectMessagePart + subject.name + " of " + subject.academyName + "\n";
			});
			const subjectOrSubjects = (errorSubjects.length == 1) ? "subject" : "subjects";
			this.makeAndShowErrorMessage(errorSubjects, subjectOrSubjects, academyNoun, subjectMessagePart);
		}
	}

	publishAcademy(element: CustomAcademy) {
		let academy = this.academyConverter(element);
		academy.unpublished = false;
		this.subscriptions.add(
			this.academyService.unpublishAcademy(academy).subscribe(
				res => {
					this.academies = this.academies.filter(x => x.id != academy.id);
					this.academySelection.clear();
					this.statusMessageService.showSuccessMessage(academy.name + " got published.");
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getSubjects()
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	publishAcademies() {
		const isUnpublished = false;
		let academies: Academy[] = [];
		for (let customAcademy of this.academySelection.selected) {
			academies.push(this.academyConverter(customAcademy));
			this.academies = this.academies.filter(x => x.id != customAcademy.id);
		}
		this.subscriptions.add(
			this.academyService.publishAcademies(academies, isUnpublished).subscribe(
				res => this.academySelection.clear(),
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getSubjects()
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	deleteExam(element: CustomExam) {
		this.subscriptions.add(
			this.examService.deleteExam(element.id).subscribe(
				res => {
					this.exams = this.exams.filter(x => x.id != element.id);
					this.examSelection.clear();
					this.statusMessageService.showSuccessMessage("Exam deleted");
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
			)
		);
	}

	deleteExams() {
		let exams: Exam[] = [];
		for (let customExam of this.examSelection.selected) {
			exams.push(this.examConverter(customExam));
		}

		this.subscriptions.add(
			this.examService.deleteExams(exams).subscribe(
				res => {
					exams.forEach(exam =>
						this.exams = this.exams.filter(x => x.id != exam.id));
					this.examSelection.clear();
					this.statusMessageService.showSuccessMessage("Exams deleted");
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err)

			)
		);
	}

	deleteCourse(element: CustomCourse) {
		this.subscriptions.add(
			this.courseService.deleteCourse(element.id).subscribe(
				res => {
					this.courses = this.courses.filter(x => x.id != element.id);
					this.courseSelection.clear();
					this.statusMessageService.showSuccessMessage("Course deleted");
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getExams()
				}
			)
		);
	}

	deleteCourses() {
		let courses: Course[] = [];
		for (let customCourse of this.courseSelection.selected) {
			courses.push(this.courseConverter(customCourse));
		}

		this.subscriptions.add(
			this.courseService.deleteCourses(courses).subscribe(
				res => {
					courses.forEach(course =>
						this.courses = this.courses.filter(x => x.id != course.id));
					this.courseSelection.clear();
					this.statusMessageService.showSuccessMessage("Courses deleted");
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getExams()
				}
			)
		);
	}

	deleteSubject(element: CustomSubject) {
		this.subscriptions.add(
			this.subjectService.deleteSubject(element.id).subscribe(
				res => {
					this.subjects = this.subjects.filter(x => x.id != element.id);
					this.subjectSelection.clear();
					this.statusMessageService.showSuccessMessage("Subject deleted")
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	deleteSubjects() {
		let subjects: Subject[] = [];
		for (let customSubject of this.subjectSelection.selected) {
			subjects.push(this.subjectConverter(customSubject));
		}
		this.subscriptions.add(
			this.subjectService.deleteSubjects(subjects).subscribe(
				res => {
					subjects.forEach(subject =>
						this.subjects = this.subjects.filter(x => x.id != subject.id));
					this.subjectSelection.clear();
					this.statusMessageService.showSuccessMessage("Subjects deleted")
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	deleteAcademy(element: CustomAcademy) {
		this.subscriptions.add(
			this.academyService.deleteAcademy(element.id).subscribe(
				res => {
					this.academies = this.academies.filter(x => x.id != element.id);
					this.academySelection.clear();
					this.statusMessageService.showSuccessMessage("Faculty deleted")
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getSubjects()
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	deleteAcademies() {
		let academies: Academy[] = [];
		for (let customAcademy of this.academySelection.selected) {
			academies.push(this.academyConverter(customAcademy));
		}
		
		this.subscriptions.add(
			this.academyService.deleteAcademies(academies).subscribe(
				res => {
					academies.forEach(academy =>
						this.academies = this.academies.filter(x => x.id != academy.id));
						this.academySelection.clear();
						this.statusMessageService.showSuccessMessage("Faculties deleted")
				},
				err => this.statusMessageService.showErrorMessage("Error", "Error: " + err),
				() => {
					this.getSubjects()
					this.getCourses()
					this.getExams()
				}
			)
		);
	}

	isParentUnpublished(entities: any[], entityId: number) {
		return entities.find(entity => entity.id == entityId);
	}

	makeAndShowErrorMessage(array: any[], childNoun: string, parentNoun: string, childMessagePart: string) {
		const thisOrThese = (array.length == 1) ? "this" : "these";

		let errorMessage = "The " + childNoun + " of the " + parentNoun + ":\n"
		errorMessage = errorMessage + childMessagePart
		errorMessage = errorMessage + "is not published. Please publish the " + parentNoun + " if you want " + thisOrThese + " published.";

		this.statusMessageService.showErrorMessage(parentNoun + " not published", errorMessage);
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
			|| this.academySelection.selected.length !== 0) 
			? this.isSelectionButtonsDisabled = false 
			: this.isSelectionButtonsDisabled = true;
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
		this.isAnyCheckboxSelected();
	}

	sortExam(sort: Sort) {
		const data = this.exams.slice();
		if (!sort.active || sort.direction === '') {
			this.exams = data;
			return;
		}

		this.exams = data.sort((a, b) => {			
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return compare(a.filename, b.filename, isAsc);
				case 'date': return compare(a.date, b.date, isAsc);
				case 'unpublishDate': return compare(a.unpublishDate, b.unpublishDate, isAsc);
				case 'courseName': return compare(a.courseName, b.courseName, isAsc);
				default: return 0;
			}
		});
	} 

	sortCourse(sort: Sort) {
		const data = this.courses.slice();
		if (!sort.active || sort.direction === '') {
			this.courses = data;
			return;
		}

		this.courses = data.sort((a, b) => {			
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return compare(a.name, b.name, isAsc);
				case 'courseCode': return compare(a.courseCode, b.courseCode, isAsc);
				case 'subjectName': return compare(a.subjectName, b.subjectName, isAsc);
				default: return 0;
			}
		});
	} 

	sortSubject(sort: Sort) {
		const data = this.subjects.slice();
		if (!sort.active || sort.direction === '') {
			this.subjects = data;
			return;
		}

		this.subjects = data.sort((a, b) => {			
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return compare(a.name, b.name, isAsc);
				case 'code': return compare(a.code, b.code, isAsc);
				case 'academyName': return compare(a.academyName, b.academyName, isAsc);
				default: return 0;
			}
		});
	} 

	sortAcademy(sort: Sort) {
		const data = this.academies.slice();
		if (!sort.active || sort.direction === '') {
			this.academies = data;
			return;
		}

		this.academies = data.sort((a, b) => {			
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'name': return compare(a.name, b.name, isAsc);
				case 'abbreviation': return compare(a.abbreviation, b.abbreviation, isAsc);
				default: return 0;
			}
		});
	} 
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
