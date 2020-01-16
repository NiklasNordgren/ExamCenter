import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Subject } from '../model/subject.model';
import { Exam } from '../model/exam.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UnpublishService {
	constructor(private http: HttpClient) {}

	getUnpublishedSubjects() {
		return this.http.get<Subject[]>('/api/subjects/unpublished');
	}

	getUnpublishedExams() {
		return this.http.get<Exam[]>('/api/exams/unpublished');
	}

	publishExam(exam: Exam) {
		return this.http.post('/api/exams/unpublish', exam);
	}

	deleteExam(id: number) {
		return this.http.delete('/api/exams/' + id);
	}
}
