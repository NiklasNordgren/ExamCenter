import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subject } from 'src/app/model/subject.model';
import { Course } from 'src/app/model/course.model';
import { Exam } from 'src/app/model/exam.model';

@Component({
  selector: 'app-select-exam-properties',
  templateUrl: './select-exam-properties.component.html',
  styleUrls: ['./select-exam-properties.component.scss']
})
export class SelectExamPropertiesComponent implements OnInit {

  @Input() examsToUpload: Exam[];

  @Input() academies: Academy[];
  @Input() subjects: Subject[];
  @Input() courses: Course[];

  @Output() courseIdEmitter = new EventEmitter<number>();

  subjectsFilteredByAcademyId: Subject[];
  coursesFilteredBySubjectId: Course[];

  selectedCourseId: number = 0;

  constructor() { }

  ngOnInit() {
    this.academyChanged(this.academies[0].id);
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
    courseId = parseInt(courseId);
    console.log(parseInt(courseId));
    this.selectedCourseId = courseId;
    this.courseIdEmitter.emit(this.selectedCourseId);
  }

}
