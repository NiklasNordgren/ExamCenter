import { Component, OnInit } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectionModel } from '@angular/cdk/collections';
import { Course } from 'src/app/model/course.model';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';

@Component({
  selector: 'course-handler',
  templateUrl: 'course-handler.component.html',
  styleUrls: ['course-handler.component.scss'],
  providers: [Navigator]
})
export class CourseHandlerComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'edit'];
  academies = [];
  subjects = [];
  courses = [];
  dataSource = [];
  selection = new SelectionModel<Course>(true, []);
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  public selectedAcademyValue: number;
  public selectedSubjectValue: number;

  constructor(private academyService: AcademyService, private navigator: Navigator,
    private subjectService: SubjectService, private courseService: CourseService) { }

  ngOnInit() {
    this.dataSource = [];
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
      this.selectedAcademyValue = this.academies[0].id;
      this.selectedAcademy(this.selectedAcademyValue);
    });
  }

  selectedAcademy(academyId: number) {

    this.subjectService.getAllSubjectsByAcademyId(academyId).subscribe(responseSubjects => {
      this.subjects = responseSubjects;
      this.selectedSubjectValue = this.subjects[0].id;
      this.selectedSubject(this.selectedSubjectValue);
    });
  }
  selectedSubject(subjectId: number) {

    this.courseService.getAllCoursesBySubjectId(subjectId).subscribe(responseCourses => {
      this.courses = responseCourses;
      this.dataSource = this.courses;
    });
  }

  //For the checkboxes 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  // Selects all rows if they are not all selected; otherwise clear selection. 
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }
}
