import { Injectable } from '@angular/core';
import { Exam } from '../model/exam.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }

  getAllExamsByCourseId(id: any){
    return this.http.get<Exam[]>("/api/subjects/exam/" + id);
  }
}
