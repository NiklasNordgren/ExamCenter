import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamService } from 'src/app/service/exam.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();
  private name = 'Filename';
  private data = [];
  private url = '/exam/';

  constructor(private route: ActivatedRoute, private service: ExamService) { }

  ngOnInit() {
    this.subscriptions.add(this.route.paramMap.subscribe(params => {
      const subjectId = parseInt(params.get('id'), 10);
      this.setExamsByCourseId(subjectId);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  setExamsByCourseId(courseId) {
    this.service.getAllExamsByCourseId(courseId).subscribe(exams => {
      this.data = [];
      exams.forEach(exam => {
        this.data.push({
          id: exam.id,
          name: exam.filename
        });
      });
    });
  }
}
