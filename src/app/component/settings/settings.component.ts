import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/service/settings.service';
import { Subscription } from 'rxjs';
import { faCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	settingsLoaded: boolean = false;
	faCog: IconDefinition = faCog;
	private form: FormGroup;
	

	constructor(private settingsService: SettingsService, private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			cookieSessionMinutes: '',
			unpublishTimeYears: '',
			homePageHtml: '',
			aboutPageHtml: ''
		});
		const sub = this.settingsService.getCurrentSettings().subscribe(settings => {
			this.form.get('cookieSessionMinutes').setValue(settings.cookieSessionMinutes);
			this.form.get('unpublishTimeYears').setValue(settings.unpublishTimeYears);
			this.form.get('homePageHtml').setValue(settings.homePageHtml);
			this.form.get('aboutPageHtml').setValue(settings.aboutPageHtml);
			this.settingsLoaded = true;
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
