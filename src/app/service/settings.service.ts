import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from './../model/settings.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	constructor(private http: HttpClient) {}

	getSettings() {
		return this.http.get<Observable<Settings>>('/api/settings/');
	}

	updateSettings(settings: Settings) {
		return this.http.patch<Observable<Settings>>('/api/settings/', settings);
	}
}
