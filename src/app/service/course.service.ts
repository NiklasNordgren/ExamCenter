import { Injectable } from '@angular/core';
import { Course } from '../model/course.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CourseServiceService {

	constructor(private http: HttpClient) { }

	getAllCoursesBySubjectId(id: any) {
		return this.http.get<Course[]>('/api/courses/subject/' + id);
	}
}
