import { Injectable } from '@angular/core';
import { Exam } from '../model/exam.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ExamService {

	constructor(private http: HttpClient) { }

	saveExam(exam: Exam): Observable<Exam> {
		return this.http.post<Exam>('/api/exams', exam);
	}

}
