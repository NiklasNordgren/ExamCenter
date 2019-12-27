import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';
import { Course } from 'src/app/model/course.model';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './format-datepicker';
import { Exam } from 'src/app/model/exam.model';

@Component({
  selector: 'app-select-exam-properties',
  templateUrl: './select-exam-properties.component.html',
  styleUrls: ['./select-exam-properties.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class SelectExamPropertiesComponent implements OnInit {

  @Input() tempId: number;

  @Input() academies: Academy[];
  @Input() subjects: Subject[];
  @Input() courses: Course[];
  @Input() uploadedExams: Exam[];

  @Output() courseIdEmitter = new EventEmitter<number>();
  @Output() examDateEmitter = new EventEmitter<Date>();

  subjectsFilteredByAcademyId: Subject[];
  coursesFilteredBySubjectId: Course[];

  id: number;
  selectedCourseId: number = 0;
  selectedDate = new Date();

  constructor() { }

  ngOnInit() {
    this.id = this.tempId;
    this.academyChanged(this.academies[0].id);
    this.setSelectedExamDate(this.selectedDate);
  }

  academyChanged(academyId: number): void {
    this.subjectsFilteredByAcademyId = this.subjects.filter(x => x.academyId == academyId);
    if (this.subjectsFilteredByAcademyId && this.subjectsFilteredByAcademyId.length > 0)
      this.subjectChanged(this.subjectsFilteredByAcademyId[0].id);
    else
      this.setSelectedCourseId(0);
  }

  subjectChanged(subjectId: number): void {
    this.coursesFilteredBySubjectId = this.courses.filter(x => x.subjectId == subjectId);
    if (this.coursesFilteredBySubjectId && this.coursesFilteredBySubjectId.length > 0)
      this.setSelectedCourseId(this.coursesFilteredBySubjectId[0].id);
    else
      this.setSelectedCourseId(0);
  }

  setSelectedCourseId(courseId: any) {
    if (typeof courseId === "string") {
      courseId = parseInt(courseId);
    }
    this.selectedCourseId = courseId;
    this.courseIdEmitter.emit(this.selectedCourseId);
  }

  setSelectedExamDate(examDate: Date) {
    this.examDateEmitter.emit(this.selectedDate);
  }

  isExamUploaded(): boolean{
    return this.uploadedExams.find(x => x.tempId === this.id) === undefined ? false : true;
  }

}
