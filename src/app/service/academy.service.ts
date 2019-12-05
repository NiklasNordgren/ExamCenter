import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AcademyService {

  constructor(private http: HttpClient) { }

  getAllAcademies(){
    return this.http.get<Academy[]>("/api/sport/all");
  }

}
