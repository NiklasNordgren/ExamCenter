import { Component, OnInit } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course.model';
import { ExamService } from 'src/app/service/exam.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  selectedAcademyValue: number;
  private academies: Academy[];
  private subjects: Subject[];
  private courses: Course[];
  private form: FormGroup;
  private subscriptions = new Subscription();
  private id: number;
  dataSource = [];
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  selectedSubjectValue: number;
  selectedCourseValue: number;
  exams: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private subjectService: SubjectService, private academyService: AcademyService,
    private courseService: CourseService, private examService: ExamService) { }


  ngOnInit() {
    //If id = 0, it specifies a new object.
    this.form = this.formBuilder.group({
      academy: '',
      subject: '',
      code: '',
      name: ''
    });
    //If id != 0, it specifies editing an object. Here's how we find the object in question.
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id'), 10);
        this.handleId();
      })
    );
/*
    //Get all the academies for the dropdownlist of academies.
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
    });
*/
    this.dataSource = this.subjects;

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleId() {
    if (this.id != 0) {
      this.courseService.getCourseById(this.id).subscribe(course => {
        this.form = this.formBuilder.group({
          academy: this.subjectService.getSubjectById(course.subjectId).subscribe(subject => {
           subject.academyId} ),
          subject: course.subjectId,
          code: course.courseCode,
          name: course.name
        });
        this.selectedSubjectValue = course.subjectId;
      });

    }
  }
  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
    }
  }
  selectedAcademy(academyId: number) {
    this.subjectService.getAllSubjectsByAcademyId(academyId).subscribe(responseSubjects => {
      this.subjects = responseSubjects;
      this.dataSource = this.subjects;
      this.selectedSubjectValue = this.subjects[0].id;
      this.selectedSubject(this.selectedSubjectValue);
    });
  }
  selectedSubject(subjectId: number){    
    this.courseService.getAllCoursesBySubjectId(subjectId).subscribe(responseCourses => {
      this.courses = responseCourses;
      this.dataSource = this.courses;
      this.selectedCourseValue = this.courses[0].id;
      this.selectedCourse(this.selectedCourseValue);
    });
  }
  selectedCourse(courseId: number){
    this.examService.getAllExamsByCourseId(courseId).subscribe(responseExams => {
      this.exams = responseExams;
      this.dataSource = this.exams;
    });
  }


}

