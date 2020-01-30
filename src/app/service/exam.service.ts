import { Injectable } from '@angular/core';
import { Exam } from '../model/exam.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ExamService {
	constructor(private http: HttpClient) { }

	getAllExams() {
		return this.http.get<Exam[]>('api/exams/all');
	}

	getExamById(id: number) {
		return this.http.get<Exam>('api/exams/' + id);
	}

	getAllExamsByCourseId(id: any) {
		return this.http.get<Exam[]>('/api/exams/course/' + id);
	}

	saveExam(exam: Exam) {
		return this.http.post<Exam>('/api/exams/', exam);
	}

	deleteExam(id: number) {
		return this.http.delete<Exam>('/api/exams/' + id);
	}

	deleteExams(exams: Exam[]) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: exams
		};
		return this.http.delete<Exam[]>('/api/exams/', options);
	}

	getUnpublishedExams() {
		return this.http.get<Exam[]>('/api/exams/unpublished');
	}

	publishExam(exam: Exam) {
		return this.http.post('/api/exams/unpublish', exam);
	}

	publishExams(exams: Exam[], isUnPublished: boolean) {
		this.setExamsIsUnpublished(exams, isUnPublished);
		return this.http.post('/api/exams/unpublishList', exams);
	}

	private setExamsIsUnpublished( exams: Exam[], isUnPublished: boolean) {
		exams.forEach(exam => {
		  exam.unpublished = isUnPublished;
		});
	  }
}
