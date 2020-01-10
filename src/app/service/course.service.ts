import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CourseService {
	constructor(private http: HttpClient) {}

	getCourseById(courseId: number) {
		return this.http.get<Course>('api/courses/' + courseId);
	}

	getAllCoursesBySubjectId(subjectId: number) {
		return this.http.get<Course[]>('api/courses/subject/' + subjectId);
	}

  getAllCourses(){
    return this.http.get<Course[]>("api/courses/all");
  }

  getUnpublishedCourses() {
		return this.http.get<Course[]>('/api/courses/unpublished');
  }

  saveCourse(course: Course){
		return this.http.post<Course>('/api/courses', course).subscribe(data => {
    });
	}

	publishCourse(course: Course) {
		return this.http.post('/api/courses/unpublish', course).subscribe(data => {
		});
  }

  deleteCourse(id: number) {
    return this.http.delete('/api/courses/' + id).subscribe(data => {
    });;
  }

  unpublishCourses(courses: Course[]): Observable<Course> {
    return this.http.post<Course>('/api/courses/unpublish/' + true, courses);
  }
}
