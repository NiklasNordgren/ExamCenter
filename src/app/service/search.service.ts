import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { Course } from "../model/course.model";
import { Subject } from "../model/subject.model";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class SearchService {
	constructor(private http: HttpClient) {}

	searchForSubjectsAndCourses(searchText: string) {
		return forkJoin([
			this.http.get<Observable<Subject[]>>(
				"/api/subjects/search/" + searchText
			),
			this.http.get<Observable<Course[]>>("/api/courses/search/" + searchText)
		]);
	}
}
