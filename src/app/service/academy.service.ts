import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Academy } from '../model/academy.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AcademyService {

	constructor(private http: HttpClient) { }

	getAllAcademies() {
		return this.http.get<Academy[]>('/api/academies/all');
	}
	getAcademyById(id: number) {
		return this.http.get<Academy>('/api/academies/' + id);
	}
	saveAcademy(academy: any): Observable<Academy> {
		return this.http.post<Academy>('/api/academies/', academy);
	}
	unpublishAcademy(academy: Academy): Observable<Academy> {
		return this.http.post<Academy>('/api/academies/unpublish/' + academy.unpublished, academy );
	}
	unpublishAcademies(academies: Academy[]): Observable<Academy> {
		return this.http.post<Academy>('/api/academies/unpublish/' + true, academies);
	}
}
