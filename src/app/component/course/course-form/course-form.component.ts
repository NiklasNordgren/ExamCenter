import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course.model';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { StatusMessageService } from 'src/app/service/status-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  providers: [Navigator]
})
export class CourseFormComponent implements OnInit {

  academies: Academy[];
  subjects: Subject[];
  course: Course = new Course();
  form: FormGroup;
  private subscriptions = new Subscription();
  id: number;
  returnNav: string;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  createFormId: number = 0;
  subjectCode: string = "";
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private academyService: AcademyService,
    private courseService: CourseService,
    public navigator: Navigator,
    private statusMessageService: StatusMessageService) { }

  ngOnInit() {
    //If id = 0, it specifies a new object.
    this.form = this.formBuilder.group({
      academy: '',
      subject: '',
      courseCode: '',
      name: ''
    });
    //If id != 0, it specifies editing an object. Here's how we find the object in question.
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id'), 10);
        this.returnNav = params.get('returnNav');

        const sub = this.academyService.getAllAcademies().subscribe(
          responseAcademies => {
            this.academies = responseAcademies
            this.handleId();
          },
          error => this.onError(error)
        );
        this.subscriptions.add(sub);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleId() {
    if (this.id == this.createFormId) {
      this.form.get("academy").setValue(this.academies[0].id);
      this.selectedAcademy(this.academies[0].id);
    } else {
      const sub = this.courseService.getCourseById(this.id).subscribe(
        course => this.handleCourse(course)
      );
      this.subscriptions.add(sub);
    }
  }

  //  Only used for editform
  handleCourse(course: Course) {
    const sub = this.subjectService.getSubjectById(course.subjectId).subscribe(subject => {
      this.form = this.formBuilder.group({
        academy: subject.academyId,
        subject: subject.id,
        courseCode: course.courseCode,
        name: course.name
      });
      this.course.unpublished = course.unpublished;
      this.subjectCode = subject.code;

      this.selectedAcademy(subject.academyId, true);

    });
    this.subscriptions.add(sub);
  }

  selectedAcademy(academyId: number, isNotInitialized?: boolean) {
    const sub = this.subjectService.getAllSubjectsByAcademyId(academyId).subscribe(responseResult => {
      this.subjects = responseResult;

      if (!isNotInitialized) {
        this.selectedSubject(this.subjects[0]);
      }

    });
    this.subscriptions.add(sub);
  }

  selectedSubject(subject: Subject) {
    this.form.get("subject").setValue(subject.id)
    this.subjectCode = subject.code;
  }

  onSubmit() {
    if (this.form.valid) {

      (this.id !== this.createFormId)
        ? this.course.id = this.id
        : null;

      this.course.name = this.form.controls.name.value;
      this.course.courseCode = this.form.controls.courseCode.value;
      this.course.subjectId = this.form.controls.subject.value;

      const sub = this.courseService.saveCourse(this.course).subscribe(
        data => this.onSuccess(data),
        error => this.onError(error)
      );
      this.subscriptions.add(sub);
    }
  }

  onSuccess(data) {
    this.form.reset();
    (!this.returnNav)
      ? this.navigator.goToPage('/admin/course-handler')
      : this.navigator.goToPage('/admin/outbox')

    this.statusMessageService.showSuccessMessage(data.name + " was " +
      ((this.id == this.createFormId) ? "created" : "updated"), 'success');
  }

  onError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.statusMessageService.showErrorMessage('Not authorized. Please log in and try again', 'Error');
      this.navigator.goToPage('/login');
    } else {
      throw (error);
    }
  }

}
