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

	saveAcademy(academy: any) {
		return this.http.post<Academy>('/api/academies/', academy);
	}

	unpublishAcademy(academy: Academy) {
		return this.http.post<Academy>('/api/academies/unpublish', academy);
	}

	unpublishAcademies(academies: Academy[]) {
		this.setAcademiesIsUnpublished(academies, true);
		return this.http.post<Academy[]>('/api/academies/unpublishList/', academies);
	}

	getUnpublishedAcademies() {
		return this.http.get<Academy[]>('api/academies/unpublished');
	}

	deleteAcademy(id: number) {
		return this.http.delete('/api/academies/' + id).subscribe(data => {
		});
	}

	private setAcademiesIsUnpublished( academies: Academy[], isUnPublished: boolean) {
		academies.forEach(academy => {
			academy.unpublished = isUnPublished;
		});
	}
}
