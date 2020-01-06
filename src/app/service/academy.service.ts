import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Academy } from '../model/academy.model';

@Injectable({
	providedIn: 'root'
})
export class AcademyService {

	constructor(private http: HttpClient) { }

	getAllAcademies() {
		return this.http.get<Academy[]>('/api/academies/all');
	}
	getAcademyById(id: number){
		return this.http.get<Academy>('/api/academies/' + id);
	}

}
