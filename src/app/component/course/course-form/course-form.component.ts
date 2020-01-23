import { Component, OnInit } from '@angular/core';
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
import { ExamService } from 'src/app/service/exam.service';
import { Navigator } from 'src/app/util/navigator';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../../confirmation-ack-dialog/confirmation-ack-dialog.component';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  academies: Academy[];
  subjects: Subject[];
  courses: Course[];
  form: FormGroup;
  id: number;
  subject: Subject;

  private subscriptions = new Subscription();

  subid: number;
  acaid: number;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  selectedAcademyValue: number;
  selectedSubjectValue: number;
  exams: any;
  course: any;
  createFormId: number = 0;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private academyService: AcademyService,
    private courseService: CourseService,
    private examService: ExamService,
    public navigator: Navigator,
    private dialog: MatDialog) { }


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

    //Get all the academies for the dropdownlist of academies.
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
      this.selectedAcademyValue = this.academies[0].id;
			this.selectedAcademy(this.selectedAcademyValue);
    });
  }

  selectedAcademy(academyId: number) {
    const sub = this.subjectService.getAllSubjectsByAcademyId(academyId).subscribe(responseResult => {
			this.subjects = responseResult;
			this.selectedSubjectValue = this.subjects[0].id;
			this.selectedSubject(this.selectedSubjectValue);
		});
		this.subscriptions.add(sub);
  }

  selectedSubject(subjectId: number) {
    const sub = this.courseService.getAllCoursesBySubjectId(subjectId).subscribe(responseResult => {
			this.courses = responseResult;
		});
		this.subscriptions.add(sub);
  }

  handleId() {
    if (this.id !== this.createFormId) {
      const sub = this.courseService.getCourseById(this.id).subscribe(course => {
        this.subjectService.getSubjectById(course.subjectId).subscribe(subject => {
          this.form = this.formBuilder.group({
            academy: subject.academyId,
            subject: course.subjectId,
            code: course.courseCode,
            name: course.name
          });
        });
      });
      this.subscriptions.add(sub);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.id !== this.createFormId) { this.subject.id = this.id; }
      this.subject.name = this.form.controls.name.value;
      this.subject.code = this.form.controls.code.value;
      this.subject.academyId = this.form.controls.academy.value;
      const sub = this.subjectService.saveSubject(this.subject).subscribe(
        data => this.onSuccess(data),
        error => this.onError(error)
      );
      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSuccess(data) {
		this.form.reset();
		this.navigator.goToPage('/admin/course-handler');
		this.openAcknowledgeDialog(data.name + " was " + ((this.id == this.createFormId) ? "created" : "updated"), 'success');
	}
	
	onError(error) {
		if (error.status === 401) {
			this.navigator.goToPage('/login');
			this.openAcknowledgeDialog('Not authorized. Please log in and try again', 'error');
		} else if (error.status === 405) {
			this.openAcknowledgeDialog('Check if the name already exists.', 'error');
		} else {
			this.openAcknowledgeDialog('Something went wrong while trying to save or edit the course.', 'error');
		}
	} 

	openAcknowledgeDialog(erorrMessage: string, typeText: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = typeText;
		this.dialogRef.componentInstance.contentMessage = erorrMessage;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}
}

