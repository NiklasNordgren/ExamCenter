import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FileService implements OnDestroy {
	subscriptions: Subscription = new Subscription();

	constructor(private http: HttpClient) {}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	downloadFile(fileName: string): Observable<Blob> {
		
		return this.http
			.get('/api/files/download/' + fileName, { responseType: 'blob' })
			.pipe(map(blob => new Blob([blob], { type: 'application/pdf' })));
			

		
	}

	uploadFile(file: File) {

		const url = '/upload';
		const body = new HttpParams().set('name', file.name).set('type', file.type);
		const options = {
			headers: new HttpHeaders().set(
				'Content-Type',
				'application/x-www-form-urlencoded'
			)
		};

		const sub = this.http.post(url, body.toString(), options).subscribe(
			res => {},
			err => {}
		);
		this.subscriptions.add(sub);
	}
}
