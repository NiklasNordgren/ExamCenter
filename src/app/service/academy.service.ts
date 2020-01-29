import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Academy } from '../model/academy.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AcademyService {

	private academyUrl = 'http://localhost:9000/academies/';

	constructor(private http: HttpClient) { }

	getAllAcademies() {
		return this.http.get<Academy[]>(this.academyUrl + 'all');
	}

	getAcademyById(id: number) {
		return this.http.get<Academy>(this.academyUrl + id);
	}

	saveAcademy(academy: any) {
		return this.http.post<Academy>(this.academyUrl, academy);
	}

	unpublishAcademy(academy: Academy) {
		return this.http.post<Academy>(this.academyUrl + 'unpublish', academy);
	}

	unpublishAcademies(academies: Academy[]) {
		this.setAcademiesIsUnpublished(academies, true);
		return this.http.post<Academy[]>(this.academyUrl + 'unpublishList/', academies);
	}

	getUnpublishedAcademies() {
		return this.http.get<Academy[]>(this.academyUrl + 'unpublished');
	}

	deleteAcademy(id: number) {
		return this.http.delete(this.academyUrl + id).subscribe(data => {
		});
	}

	private setAcademiesIsUnpublished( academies: Academy[], isUnPublished: boolean) {
		academies.forEach(academy => {
			academy.unpublished = isUnPublished;
		});
	}
}
