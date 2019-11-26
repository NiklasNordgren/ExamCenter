import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<{}>> {
		const formdata: FormData = new FormData();
    formdata.append('file', file);
		const req = new HttpRequest('POST', '/upload', formdata, {
			  reportProgress: true,
			  responseType: 'text'
		});
	
		return this.http.request(req);
   }

}
