import { Component, OnInit, Input } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Course } from 'src/app/model/course.model';
import { Subject } from 'src/app/model/subject.model';
import { AcademyService } from 'src/app/service/academy.service';
import { SubjectService } from 'src/app/service/subject.service';
import { CourseService } from 'src/app/service/course.service';
import { Navigator } from 'src/app/util/navigator';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
  providers: [Navigator]
})

export class NavigatorComponent implements OnInit {
  faChevronRight = faChevronRight;
  @Input() academyId: number;
  @Input() subjectId: number;
  @Input() courseId: number;
  academy: Academy;
  subject: Subject;
  course: Course;

  constructor(private academyService: AcademyService, private subjectService: SubjectService, private courseService: CourseService,
    private navigator: Navigator) {
  }
  ngOnInit() {
    if(this.academyId != null)
      this.handleAcademy(this.academyId);
    if (this.subjectId != null)
      this.handleSubject(this.subjectId);
    else if (this.courseId != null)
      this.handleCourse(this.courseId);
  }

  handleAcademy(academyId){
    this.academyService.getAcademyById(academyId).subscribe(academy => {
      this.academy = academy;
    });
  }

  handleSubject(subjectId) {
    this.subjectService.getSubjectById(subjectId).subscribe(subject => {
      this.subject = subject;
      this.handleAcademy(subject.academyId);
    });
  }

  handleCourse(courseId) {
    this.courseService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      this.handleSubject(this.course.subjectId);
    });
  }
}
