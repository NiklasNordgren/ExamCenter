import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from './../model/settings.model';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	constructor(private http: HttpClient) {}

	getCurrentSettings() {
		return this.http.get<Settings>('/api/settings/');
	}

	getTenLatestSettings() {
		return this.http.get<Settings[]>('/api/settings/tenLatest');
	}

	postSettings(settings: Settings) {
		return this.http.post<Settings>('/api/settings/', settings);
	}

	getAboutPageHtml() {
		return this.http.get('/api/settings/about', {responseType: 'text'});
	}

	getHomePageHtml() {
		return this.http.get('/api/settings/home', {responseType: 'text'});
	}

	getUnpublishTime() {
		return this.http.get('/api/settings/unpublishTime', {responseType: 'text'});
	}
}
