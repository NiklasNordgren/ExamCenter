import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Course } from 'src/app/model/course.model';
import { Subject } from 'src/app/model/subject.model';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { ActivatedRoute } from '@angular/router';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  providers: [Navigator]
})

export class NavigatorComponent implements OnInit, OnDestroy {
  faChevronRight = faChevronRight;
  faHome = faHome;
  @Input() academyId: number;
  @Input() subjectId: number;
  @Input() courseId: number;
  private subscriptions = new Subscription();
  academy: Academy;
  subject: Subject;
  course: Course;

  constructor(
    private academyService: AcademyService,
    private subjectService: SubjectService,
    private courseService: CourseService,
    public navigator: Navigator,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit() {
    if (this.academyId != null)
      this.handleAcademy(this.academyId);
    if (this.subjectId != null)
      this.handleSubject(this.subjectId);
    else if (this.courseId != null)
      this.handleCourse(this.courseId);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  handleAcademy(academyId) {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.academyId = parseInt(params.get('id'), 10);
        this.getAcademy(this.academyId);
      })
    );
  }

  getAcademy(academyId: number) {
    this.subscriptions.add(
      this.academyService.getAcademyById(academyId).subscribe(academy => {
        this.academy = academy;
      }));
  }

  handleSubject(subjectId) {
    this.subscriptions.add(
      this.subjectService.getSubjectById(subjectId).subscribe(subject => {
        this.subject = subject;
        this.getAcademy(subject.academyId);
      }));
  }

  handleCourse(courseId) {
    this.subscriptions.add(
      this.courseService.getCourseById(courseId).subscribe(course => {
        this.course = course;
        this.handleSubject(this.course.subjectId);
      }));
  }
}
