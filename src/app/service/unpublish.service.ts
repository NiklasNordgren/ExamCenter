import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class UnpublishService {

  constructor(private http: HttpClient) { }
  
	getUnpublishedSubjects() {
		return this.http.get<Subject[]>('/api/subjects/unpublished');
	}
}
