import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
		return this.http.post<Course>('/api/courses/', course);
	}

	publishCourse(course: Course) {
		return this.http.post('/api/courses/unpublish', course);
  }

  deleteCourse(id: number){
    return this.http.delete('/api/courses/' + id);
  }

  deleteCourses(courses: Course[]) {
    const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: courses
		  };
    return this.http.delete('/api/courses/', options);
  }

  unpublishCourses(courses: Course[]){
    this.setCoursesIsUnpublished(true, courses);
    return this.http.post<Course>('/api/courses/unpublishList/', courses);
  }
  
  private setCoursesIsUnpublished(isUnPublished: boolean, courses: Course[]){
    courses.forEach(course => {
      course.unpublished = isUnPublished;
    });
  }
}
