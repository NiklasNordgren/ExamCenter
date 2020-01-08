import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Course } from '../model/course.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllCoursesBySubjectId(subjectId: number) {
    return this.http.get<Course[]>("api/courses/published/subject/" + subjectId);
  }

  getAllCourses() {
    return this.http.get<Course[]>("api/courses/all");
  }

  unpublishCourses(courses: Course[]): Observable<Course> {
    return this.http.post<Course>('/api/courses/unpublish/' + true, courses);
  }
}
