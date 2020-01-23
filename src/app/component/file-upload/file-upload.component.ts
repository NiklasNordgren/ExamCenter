import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { faUpload, faTrash, faArrowCircleDown, faArrowCircleUp, faCalendarAlt, faGraduationCap, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../../service/exam.service';
import { Exam } from '../../model/exam.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AcademyService } from '../../service/academy.service';
import { Academy } from '../../model/academy.model';
import { Subject } from '../../model/subject.model';
import { Course } from '../../model/course.model';
import { Subscription } from 'rxjs';

import { SubjectService } from '../../service/subject.service';
import { CourseService } from '../../service/course.service';
import { SettingsService } from '../../service/settings.service';

import { MatTable, MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../confirmation-ack-dialog/confirmation-ack-dialog.component';

export interface FileTableItem {
	tempFileId: number;
	name: string;
	size: string;
	status: string;
	autoMatchCourse: string;
	autoMatchDate: string;
}

@Component({
	selector: 'app-file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
		]),
	],
})
export class FileUploadComponent implements OnInit, OnDestroy {
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	subscriptions = new Subscription();

	academies: Academy[] = [];
	subjects: Subject[] = [];
	courses: Course[] = [];
	exams: Exam[] = [];

	examsToUpload: Exam[] = [];
	uploadedExams: Exam[] = [];
	activeExam: Exam;

	expandedElement: FileTableItem | null;

	@ViewChild('fileInput', { static: false }) fileInput: ElementRef;
	@ViewChild(MatTable, { static: true }) table: MatTable<any>;

	uploader: FileUploader = new FileUploader(
		{
			url: 'api/files/upload',
			autoUpload: false,
			headers: [{ name: 'Accept', value: 'application/json' }],
			allowedMimeType: ['application/pdf'],
			maxFileSize: 5 * 1024 * 1024 // 5MB
		}
	);

	tempFileId = 1;
	isFileOverDropZone = false;
	accentColor = 'accent';
	mode = 'determinate';

	faUpload = faUpload;
	faTrash = faTrash;
	faArrowCircleDown = faArrowCircleDown;
	faArrowCircleUp = faArrowCircleUp;
	faCalendarAlt = faCalendarAlt;
	faGraduationCap = faGraduationCap;
	faCheck = faCheck;
	faTimes = faTimes;

	dataSource: FileTableItem[] = [];
	displayedColumns: string[] = ['name', 'size', 'autoMatchCourse', 'autoMatchDate', 'status', 'actions'];

	unpublishTime: number;

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private settingsService: SettingsService,
		private examService: ExamService,
		private academyService: AcademyService,
		private subjectService: SubjectService,
		private courseService: CourseService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.getUnpublishYear();
		this.getAllAcademies();
		this.getAllSubjects();
		this.getAllCourses();
		this.getAllExams();
		this.initUploader();
	}

	getUnpublishYear() {
		const sub = this.settingsService.getUnpublishTime().subscribe(time => {
			this.unpublishTime = new Number("time").valueOf();
		});
		this.subscriptions.add(sub);
	}

	initUploader(): void {
		this.uploader.onAfterAddingFile = (fileItem) => {

			this.expandedElement = null;

			if (!this.isExamInUploadQueue(fileItem.file.name) && !this.isExamInDatabase(fileItem.file.name)) {

				this.addToExamsToUpload(fileItem.file.name);
				fileItem.withCredentials = false;
				fileItem.index = this.tempFileId;

				this.dataSource = this.dataSource.concat({ tempFileId: this.tempFileId, name: fileItem.file.name, size: Math.round(fileItem.file.size / 1000) + ' kB', status: '', autoMatchCourse: '', autoMatchDate: '' });
				this.changeDetectorRef.detectChanges();
				const row = this.dataSource.find(x => x.tempFileId === this.tempFileId);
				this.setAutoMatchedCourseStatus(row);
				this.setAutoMatchedDateStatus(row);
				this.tempFileId++;
				console.log('Succesfully added file: ' + fileItem.file.name + ' to the queue.');
			} else {
				if (this.isExamInUploadQueue(fileItem.file.name)) {
					this.showErrorDialog('Exam ' + fileItem.file.name + ' already exists in the upload queue.');
				}
				if (this.isExamInDatabase(fileItem.file.name)) {
					this.showErrorDialog('Exam ' + fileItem.file.name + ' already exists in the database.');
				}
				this.removeFromQueue(fileItem);
			}

		};

		this.uploader.onWhenAddingFileFailed = (file) => {
			if (!this.isFileSizeValid(file.size)) {
				this.showErrorDialog('Max file size is 5MB.');
			}
			console.log('Failed to add file: ' + file.name + ' to the queue.');
		};

		this.uploader.onCompleteItem = (fileItem: FileItem, response: any, status: any, headers: any) => {
			console.log('Item: ' + fileItem.file.name);
			console.log('Status: ' + status);
			console.log('Response: ' + response);

			if (status === 200) {
				const exam = this.examsToUpload.find(x => x.filename === fileItem.file.name);
				const sub = this.examService.saveExam(exam).subscribe(e => {
					console.log(e);
					this.dataSource.find(x => x.tempFileId === exam.tempId).status = 'Uploaded';
					this.removeFromExamsToUpload(exam.tempId);
					exam.uploaded = true;
					this.exams.push(exam);
					this.uploadedExams.push(exam);
				});
				this.subscriptions.add(sub);
			}
		};

		this.uploader.onErrorItem = (fileItem: FileItem, response: any, status: any, headers: any) => {
			this.dataSource.find(x => x.name === fileItem.file.name).status = 'Upload error';
			this.showErrorDialog('Could not upload file.');
		};
	}

	showErrorDialog(message: string){
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = "Error";
		this.dialogRef.componentInstance.contentMessage = message;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	fileOverDropZone(e: any): void {
		this.isFileOverDropZone = e;
	}

	fileClicked() {
		this.fileInput.nativeElement.click();
	}

	clearQueue() {
		this.uploader.clearQueue();
		this.dataSource = [];
		this.examsToUpload = [];
	}

	uploadFromQueue(element: any) {
		this.uploader.queue.find(x => x.index === element.tempFileId).upload();
	}

	removeFromQueue(element: any) {

		for (let i = 0; i < this.uploader.queue.length; i++) {
			if (this.uploader.queue[i].index === element.tempFileId) {
				this.uploader.queue[i].remove();
			}
		}

		this.dataSource = this.dataSource.filter(x => {
			return x.tempFileId !== element.tempFileId;
		});

		this.removeFromExamsToUpload(element.tempFileId);

	}

	getAllAcademies() {
		const sub = this.academyService.getAllAcademies().subscribe(academies => {
			this.academies = academies;
		});
		this.subscriptions.add(sub);
	}

	getAllSubjects() {
		const sub = this.subjectService.getAllSubjects().subscribe(subjects => {
			this.subjects = subjects;
		});
		this.subscriptions.add(sub);
	}

	getAllCourses() {
		const sub = this.courseService.getAllCourses().subscribe(courses => {
			this.courses = courses;
		});
		this.subscriptions.add(sub);
	}

	getAllExams() {
		const sub = this.examService.getAllExams().subscribe(exams => {
			this.exams = exams;
		});
		this.subscriptions.add(sub);
	}

	selectedCourseIdChanged(courseId: number): void {
		if (this.expandedElement) {
			this.activeExam = this.examsToUpload.find(x => x.tempId === this.expandedElement.tempFileId);
		}
		if (this.activeExam) {
			this.activeExam.courseId = courseId;
		}
		this.setStatus(courseId);
	}

	setStatus(courseId: number): void {
		if (courseId <= 0) {
			this.dataSource.find(x => x.tempFileId === this.activeExam.tempId).status = 'Invalid course id';
		} else {
			this.dataSource.find(x => x.tempFileId === this.activeExam.tempId).status = '';
		}
	}

	selectedExamDateChanged(examDate: Date): void {
		if (this.expandedElement) {
			this.activeExam = this.examsToUpload.find(x => x.tempId === this.expandedElement.tempFileId);
		}
		if (this.activeExam) {
			const convertedDate = new Date(examDate.getTime() - (examDate.getTimezoneOffset() * 60000));
			this.activeExam.date = convertedDate;
			this.activeExam.unpublishDate = new Date(convertedDate.getFullYear() + this.unpublishTime, convertedDate.getMonth(), convertedDate.getDate());
		}
	}

	addToExamsToUpload(name: string): void {
		const exam = new Exam();
		exam.filename = name;
		exam.date = new Date();
		exam.unpublished = false;
		exam.unpublishDate = new Date();
		exam.tempId = this.tempFileId;
		exam.courseId = 0;
		exam.uploaded = false;
		exam.autoMatchDate = false;
		exam.autoMatchCourse = false;
		this.activeExam = exam;
		this.examsToUpload.push(exam);
	}

	removeFromExamsToUpload(tempId: number) {
		this.activeExam = null;
		const index = this.examsToUpload.findIndex(x => x.tempId === tempId);
		if (index > -1) {
			this.examsToUpload.splice(index, 1);
		}
	}

	isValidUpload(element: any) {
		return !this.isUploadedFromQueue(element) && this.hasValidCourseId(element);
	}

	isUploadedFromQueue(element: any) {
		return this.uploader.queue.find(x => x.index === element.tempFileId) === undefined ? true : false;
	}

	hasValidCourseId(element: any) {
		if (this.examsToUpload.find(x => x.tempId === element.tempFileId)) {
			return this.examsToUpload.find(x => x.tempId === element.tempFileId).courseId > 0;
		}
	}

	isUploadAllDisabled(): boolean {
		return this.uploader.getNotUploadedItems().length === 0 || !this.isExamCourseIdsValid();
	}

	isExamCourseIdsValid(): boolean {
		return this.examsToUpload.find(x => x.courseId <= 0) === undefined ? true : false;
	}

	isExamInDatabase(filename: string): boolean {
		return this.exams.find(x => x.filename === filename) !== undefined ? true : false;
	}

	isExamInUploadQueue(filename: string): boolean {
		return this.examsToUpload.find(x => x.filename === filename) !== undefined ? true : false;
	}

	isFileSizeValid(fileSize: number): boolean {
		return fileSize < 5 * 1024 * 1024;
	}

	getUploadProgress(): number {
		return (this.dataSource.filter(x => x.status === 'Uploaded').length / this.dataSource.length) * 100;
	}

	setAutoMatchedCourseStatus(row: FileTableItem): void {
		if (this.activeExam.autoMatchCourse) {
			row.autoMatchCourse = 'true';
		} else {
			row.autoMatchCourse = 'false';
		}
	}

	setAutoMatchedDateStatus(row: FileTableItem): void {
		if (this.activeExam.autoMatchDate) {
			row.autoMatchDate = 'true';
		} else {
			row.autoMatchDate = 'false';
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

}
