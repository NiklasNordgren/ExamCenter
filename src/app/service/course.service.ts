import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Course } from "../model/course.model";

@Injectable({
	providedIn: "root"
})
export class CourseService {
	constructor(private http: HttpClient) {}

	getAllCoursesBySubjectId(subjectId: number) {
		return this.http.get<Course[]>("api/courses/subject/" + subjectId);
	}

	getAllCourses() {
		return this.http.get<Course[]>("api/courses/all");
	}

	getCourseById(courseId: number) {
		return this.http.get<Course>("api/courses/" + courseId);
	}
}
