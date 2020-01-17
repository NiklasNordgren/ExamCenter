import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(private http: HttpClient) { }

	login(loginData: any) {
		const headers = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
		return this.http.post('/api/login/', loginData, headers);
	}
	logout(){
		return this.http.post('/api/login/logout/', null);
	}
}
