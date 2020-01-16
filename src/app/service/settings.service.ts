import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from './../model/settings.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	constructor(private http: HttpClient) {}

	getCurrentSettings() {
		return this.http.get<Settings>('/api/settings/current');
	}

	postSettings(settings: Settings) {
		return this.http.post<Settings>('/api/settings/', settings);
	}

}
