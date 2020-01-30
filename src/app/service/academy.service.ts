import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

	saveAcademy(academy: any) {
		return this.http.post<Academy>('/api/academies/', academy);
	}

	unpublishAcademy(academy: Academy) {
		return this.http.post<Academy>('/api/academies/unpublish', academy);
	}

	publishAcademies(academies: Academy[], isUnPublished: boolean) {
		this.setAcademiesIsUnpublished(academies, isUnPublished);
		return this.http.post<Academy[]>('/api/academies/unpublishList/', academies);
	}

	getUnpublishedAcademies() {
		return this.http.get<Academy[]>('api/academies/unpublished');
	}

	deleteAcademy(id: number) {
		return this.http.delete('/api/academies/' + id);
	}

	deleteAcademies(academies: Academy[]) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: academies
		};
		return this.http.delete('/api/subjects/', options);
	}

	private setAcademiesIsUnpublished(academies: Academy[], isUnPublished: boolean) {
		academies.forEach(academy => {
			academy.unpublished = isUnPublished;
		});
	}
}
