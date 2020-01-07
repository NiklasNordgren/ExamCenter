import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from '../model/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) { }

  getAllSubjectsByAcademyId(academyId: number){
    return this.http.get<Subject[]>("api/subjects/academy/" + academyId);
  }

  getAllSubjects(){
    return this.http.get<Subject[]>("api/subjects/all");
  }

}
