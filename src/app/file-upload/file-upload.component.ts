import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExamService } from '../service/exam.service';
import { Exam } from '../model/exam.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AcademyService } from '../service/academy.service';
import { Academy } from '../model/academy.model';
import { Subject } from '../model/subject.model';
import { Course } from '../model/course.model';
import { Subscription } from 'rxjs';
import { SubjectService } from '../service/subject.service';
import { CourseService } from '../service/course.service';
import { MatTable } from '@angular/material';

/**
 * TODO:
 * 
 * Validering:
 * Kontrollera filnamn med de som finns i uppladdningskön och i databasen.
 * 
 */

export interface FileTableItem {
  tempFileId: number;
  name: string;
  size: string;
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
export class FileUploadComponent implements OnInit {

  subscriptions = new Subscription();

  academies: Academy[] = [];
  subjects: Subject[] = [];
  courses: Course[] = [];
  exams: Exam[] = [];

  examsToUpload: Exam[] = [];
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
      maxFileSize: 5 * 1024 * 1024 //5MB
    }
  );;

  tempFileId = 1;
  isFileOverDropZone: boolean = false;
  accentColor = "accent";
  mode = "determinate";
  faUpload = faUpload;
  faTrash = faTrash;
  dataSource: FileTableItem[] = [];
  displayedColumns: string[] = ['name', 'size', 'actions'];

  constructor(private changeDetectorRef: ChangeDetectorRef, private examService: ExamService, private academyService: AcademyService, private subjectService: SubjectService, private courseService: CourseService) { }

  ngOnInit() {

    this.getAllAcademies();
    this.getAllSubjects();
    this.getAllCourses();
    this.getAllExams();

    this.uploader.onAfterAddingFile = (file) => {

      this.expandedElement = null;

      debugger;

      if (!this.isExamInUploadQueue(file.file.name) && !this.isExamInDatabase(file.file.name)) {
        this.addExam(file.file.name);
        file.withCredentials = false;
        file.index = this.tempFileId;

        this.dataSource = this.dataSource.concat({ tempFileId: this.tempFileId, name: file.file.name, size: Math.round(file.file.size / 1000) + "kB" });
        this.changeDetectorRef.detectChanges();
        this.tempFileId++;
        console.log("Succesfully added file: " + file.file.name + " to the queue.");
      }else{
        if(this.isExamInUploadQueue(file.file.name)){
          alert("Exam already exists in upload queue.");
        }
        if(this.isExamInDatabase(file.file.name)){
          alert("Exam already exists in the database.");
        }
        this.removeFromQueue(file);
      }

    };

    this.uploader.onBeforeUploadItem = (file) => {

    };

    this.uploader.onWhenAddingFileFailed = (file) => {
      console.log("Failed to add file: " + file.name + " to the queue.");
    };

    this.uploader.onCompleteItem = (item: FileItem, response: any, status: any, headers: any) => {
      console.log('Item: ' + item.file.name);
      console.log("Status: " + status);
      console.log("Response: " + response);
      debugger;

      if (status == 200) {
        let exam = this.examsToUpload.find(x => x.fileName == item.file.name);
        this.examService.saveExam(exam).subscribe(e => {
          console.log(e);
        });
        this.removeExam(exam.courseId);
      }

    };

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

    //TODO: Freeze dropdowns values of select-exam-properties

  }

  removeFromQueue(element: any) {

    for (let i = 0; i < this.uploader.queue.length; i++)
      if (this.uploader.queue[i].index === element.tempFileId)
        this.uploader.queue[i].remove();

    this.dataSource = this.dataSource.filter(x => {
      return x.tempFileId !== element.tempFileId;
    });

    this.removeExam(element.tempFileId);

  }

  getAllAcademies() {
    let sub = this.academyService.getAllAcademies().subscribe(academies => {
      this.academies = academies;
    });
    this.subscriptions.add(sub);
  }

  getAllSubjects() {
    let sub = this.subjectService.getAllSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
    this.subscriptions.add(sub);
  }

  getAllCourses() {
    let sub = this.courseService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
    this.subscriptions.add(sub);
  }

  getAllExams() {
    let sub = this.examService.getAllExams().subscribe(exams => {
      this.exams = exams;
    });
    this.subscriptions.add(sub);
  }

  selectedCourseIdChanged(courseId: number) {
    if (this.expandedElement) {
      this.activeExam = this.examsToUpload.find(x => x.tempId == this.expandedElement.tempFileId);
    }
    if (this.activeExam) {
      this.activeExam.courseId = courseId;
    }
  }

  addExam(name: string): void {
    let exam = new Exam();
    exam.fileName = name;
    exam.date = new Date();
    exam.unpublished = false;
    exam.unpublishDate = new Date();
    exam.tempId = this.tempFileId;
    exam.courseId = 0;
    this.activeExam = exam;
    this.examsToUpload.push(exam);
  }

  removeExam(tempId: number) {
    this.activeExam = null;
    var index = this.examsToUpload.findIndex(x => x.tempId === tempId);
    if (index > -1) {
      this.examsToUpload.splice(index, 1);
    }
  }

  isValidUpload(element: any) {
    //test
    return !this.isUploadedFromQueue(element) && this.hasValidCourseId(element);
  }

  isUploadedFromQueue(element: any) {
    return this.uploader.queue.find(x => x.index === element.tempFileId);
  }

  hasValidCourseId(element: any) {
    //test
    if (this.examsToUpload.length > 0)
      return this.examsToUpload.find(x => x.tempId == element.tempFileId).courseId > 0;
    else false;
  }

  isExamInDatabase(fileName: string): boolean {
    return this.exams.find(x => x.fileName === fileName) !== undefined ? true : false;
  }

  isExamInUploadQueue(fileName: string): boolean {
    return this.examsToUpload.find(x => x.fileName === fileName) !== undefined ? true : false;
  }

}
