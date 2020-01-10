import { Injectable } from '@angular/core';
import { Exam } from '../model/exam.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ExamService {
	constructor(private http: HttpClient) {}

	getAllExams() {
		return this.http.get<Exam[]>('api/exams/all');
	}

	getExamById(id: number) {
		return this.http.get<Exam>('api/exams/' + id);
	}

	getAllExamsByCourseId(id: any) {
		return this.http.get<Exam[]>('/api/exams/course/' + id);
	}

	saveExam(exam: Exam): Observable<Exam> {
		return this.http.post<Exam>('/api/exams', exam);
	}

	deleteExam(id: number) {
		return this.http.delete('/api/exams/' + id).subscribe(data => {
		});;
	}

	getUnpublishedExams() {
		return this.http.get<Exam[]>('/api/exams/unpublished');
	}

	publishExam(exam: Exam) {
		return this.http.post('/api/exams/unpublish', exam).subscribe(data => {
		});
	}

	unpublishExams(exams: Exam[]) : Observable<Exam>{
		return this.http.post<Exam>('/api/exam/unpublish/' + true, exams);
	}

}
