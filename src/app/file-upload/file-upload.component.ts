import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
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

const headers = [{ name: 'Accept', value: 'application/json' }];

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

  examsToUpload: Exam[] = [];
  activeExam: Exam;

  expandedElement: FileTableItem | null;

  /*
  exam: Exam = {
    fileName: "",
    date: new Date("2019-12-09"),
    courseId: 6,
    unpublishDate: new Date("2022-12-09"),
    unpublished: false
  }
  */

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  uploader: FileUploader = new FileUploader(
    {
      url: 'api/files/upload',
      autoUpload: false,
      headers: headers,
      allowedMimeType: ['application/pdf']
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

  constructor(private examService: ExamService, private academyService: AcademyService, private subjectService: SubjectService, private courseService: CourseService) { }

  ngOnInit() {

    this.getAllAcademies();
    this.getAllSubjects();
    this.getAllCourses();

    this.uploader.onAfterAddingFile = (file) => {

      let exam = new Exam();
      exam.fileName = file.file.name;
      //TODO: hämta från input eller automatchning
      exam.date = new Date();
      exam.unpublished = false;
      //exam.unpublishDate = new Date(exam.date.getFullYear + "-" + exam.date.getMonth + "-" + exam.date.getDay);
      exam.unpublishDate = new Date();
      exam.tempId = this.tempFileId;

      this.examsToUpload.push(exam);

      this.activeExam = exam;

      file.withCredentials = false;
      file.index = this.tempFileId;
      this.dataSource = this.dataSource.concat({ tempFileId: this.tempFileId, name: file.file.name, size: Math.round(file.file.size / 1000) + "kB" });
      this.tempFileId++;

      console.log("Succesfully added file: " + file.file.name + " to the queue.");
    };


    this.uploader.onBeforeUploadItem = (file) => {


    };

    this.uploader.onWhenAddingFileFailed = (file) => {
      console.log("Failed to add file: " + file.name + " to the queue.");
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('Item:' + item);
      console.log("Status:" + status);
      console.log("Response:" + response);
      /*
      if (status == 200)
        this.examService.saveExam(this.exam).subscribe(e => {
          console.log(e);
        });
      */
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
  }

  uploadFromQueue(element: any) {
    this.uploader.queue.find(x => x.index === element.tempFileId).upload();
  }

  removeFromQueue(element: any) {

    for (let i = 0; i < this.uploader.queue.length; i++)
      if (this.uploader.queue[i].index === element.tempFileId)
        this.uploader.queue[i].remove();

    this.dataSource = this.dataSource.filter(x => {
      return x.tempFileId !== element.tempFileId;
    });

  }

  isUploadedFromQueue(element: any) {
    return this.uploader.queue.find(x => x.index === element.tempFileId) ? true : false;
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

  selectedCourseIdChanged(courseId: number) {
    this.activeExam.courseId = courseId;
    if (this.expandedElement){
      this.examsToUpload.find(x => x.tempId == this.expandedElement.tempFileId).courseId = courseId;
    }
    console.log(this.activeExam);
    console.log(this.examsToUpload);
  }

  onTableRowClick(event: any) {
    console.log('test');
    //debugger;
  }

}
