import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
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
    return this.http.get<Subject[]>("api/subjects/academy/" + academyId);
  }

  getAllPublishedSubjectsByAcademyId(academyId: number){
    return this.http.get<Subject[]>('api/subjects/published/academy/' + academyId);
  }

  getAllSubjects() {
    return this.http.get<Subject[]>("api/subjects/all");
  }

  saveSubject(subject: Subject): Observable<Subject> {
    console.log('saving...');
    console.log(subject);
    
    return this.http.post<Subject>("/api/subjects", subject);
  }

  deleteSubject(id: number) {
    return this.http.delete('/api/subjects/' + id).subscribe(data => {
    });;
  }

  unpublishSubects(subjects: Subject[]) : Observable<Subject>{
		return this.http.post<Subject>('/api/subjects/unpublish/' + true, subjects);
	}
}