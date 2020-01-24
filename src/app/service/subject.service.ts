import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../model/subject.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SubjectService {
	constructor(private http: HttpClient) { }

	getSubjectById(id: number) {
		return this.http.get<Subject>('api/subjects/' + id);
	}

	getAllSubjectsByAcademyId(academyId: number) {
		return this.http.get<Subject[]>('api/subjects/academy/' + academyId);
	}


	getUnpublishedSubjects() {
		return this.http.get<Subject[]>('api/subjects/unpublished');
	}

	getAllPublishedSubjectsByAcademyId(academyId: number) {
		return this.http.get<Subject[]>(
			'api/subjects/published/academy/' + academyId
		);
	}


	getAllSubjects() {
		return this.http.get<Subject[]>('api/subjects/all');
	}

	saveSubject(subject: Subject) {
		return this.http.post<Subject>('/api/subjects/', subject);
	}

	deleteSubject(id: number) {
		return this.http.delete('/api/subjects/' + id);
	}

	publishSubject(subject: Subject) {
		return this.http.post('/api/subjects/unpublish', subject);
	}

	unpublishSubjects(subjects: Subject[]) {
		this.setSubjectsIsUnpublished(subjects, true);
		return this.http.post<Subject[]>('/api/subjects/unpublishList/', subjects);
	}

	private setSubjectsIsUnpublished(subjects: Subject[], isUnPublished: boolean) {
		subjects.forEach(subject => {
			subject.unpublished = isUnPublished;
		});
	}
}
