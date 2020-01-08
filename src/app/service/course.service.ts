import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Course } from '../model/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  getAllCoursesBySubjectId(subjectId: number){
    return this.http.get<Course[]>("api/courses/subject/" + subjectId);
  }

  getCourseById(id: number) {
    return this.http.get<Course>("api/courses/" + id);
  } 

  getAllCourses(){
    return this.http.get<Course[]>("api/courses/all");
  }

  getUnpublishedCourses() {
		return this.http.get<Course[]>('/api/courses/unpublished');
	}

	publishCourse(course: Course) {
		return this.http.post('/api/courses/unpublish', course).subscribe(data => {
		});
	}
}
