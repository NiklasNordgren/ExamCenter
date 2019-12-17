import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseService } from 'src/app/service/course.service';


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  shortHeader = 'Code';
  name = 'Course';
  data = [];
  url = '/exams/course/';

  constructor(private route: ActivatedRoute, private service: CourseService) { }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      const subjectId = parseInt(params.get('id'), 10);
      this.setCoursesBySubjectId(subjectId);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setCoursesBySubjectId(subjectId) {
    this.service.getAllCoursesBySubjectId(subjectId).subscribe(courses => {
      this.data = [];
      courses.forEach(course => {
        this.data.push({
          name: course.name,
          shortDesc: course.courseCode,
          id: course.id
        });
      });
    });
  }
}
