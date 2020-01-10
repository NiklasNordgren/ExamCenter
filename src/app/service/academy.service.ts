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

	getAcademyById(id: number){
		return this.http.get<Academy>('/api/academies/' + id);
	}

	saveAcademy(academy: any) : Observable<Academy>{
		return this.http.post<Academy>('/api/academies/', academy);
	}

	unpublishAcademy(academy: Academy){
		return this.http.post<Academy>('/api/academies/unpublish', academy);
	}

	unpublishAcademies(academies: Academy[]) : Observable<Academy>{
		return this.http.post<Academy>('/api/academies/unpublish/' + true, academies);
	}

	getUnpublishedAcademies() {
		return this.http.get<Academy[]>('api/academies/unpublished');
	}

	deleteAcademy(id: number) {
		return this.http.delete('/api/academies/' + id).subscribe(data => {
		});;
	  }

}
