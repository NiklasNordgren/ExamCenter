import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/service/settings.service';
import { Settings } from 'src/app/model/settings.model';
import { Observable, Subscription } from 'rxjs';
import { faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	settings: Observable<Settings>;
	settingsLoaded: boolean = false;
	faCog: IconDefinition = faCog;
	private form: FormGroup;
	

	constructor(private settingsService: SettingsService, private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			cookieSessionMinutes: '',
			homePageHtml: '',
			aboutPageHtml: ''
		});
		const sub = this.settingsService.getSettings().subscribe(settings => {
			this.settings = settings;
			this.settingsLoaded = true;
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
