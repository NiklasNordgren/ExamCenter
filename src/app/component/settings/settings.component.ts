import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";
import { faCog, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Settings } from "src/app/model/settings.model";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: "app-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	settingsLoaded: boolean = false;
	settingsList: Settings[] = [];
	faCog: IconDefinition = faCog;
	private form: FormGroup;
	selectedValue: Settings;

	constructor(
		private settingsService: SettingsService,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			cookieSessionMinutes: "",
			unpublishTimeYears: "",
			homePageHtml: "",
			aboutPageHtml: ""
		});
		const sub = this.settingsService
			.getTenLatestSettings()
			.subscribe(settingsList => {
				this.settingsList = settingsList;
				this.setFormControls(settingsList[0]);
				this.settingsLoaded = true;
				this.selectedValue = settingsList[0];
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	chooseSetting(setting: Settings) {}

	setFormControls(setting: Settings) {
		this.form.controls.cookieSessionMinutes.setValue(
			setting.cookieSessionMinutes
		);
		this.form.controls.unpublishTimeYears.setValue(setting.unpublishTimeYears);
		this.form.controls.homePageHtml.setValue(setting.homePageHtml);
		this.form.controls.aboutPageHtml.setValue(setting.aboutPageHtml);
	}

	onSubmit() {
		let homePageHtml = this.form.controls.homePageHtml.value;
		let aboutPageHtml = this.form.controls.aboutPageHtml.value;
		let newHomePageHtml = this.sanitizer.sanitize(SecurityContext.HTML, homePageHtml);
		let newAboutPageHtml = this.sanitizer.sanitize(SecurityContext.HTML, aboutPageHtml);
		
		let config = new MatSnackBarConfig();

		let htmlOk = true;

		if (newHomePageHtml !== homePageHtml) {
			this.snackBar.open('Home page HTML was deemed unsafe.', 'OK');
			htmlOk = false;
		}
		if (newAboutPageHtml !== aboutPageHtml) {
			this.snackBar.open('About page HTML was deemed unsafe.', 'OK');
			htmlOk = false;
		}
		if (this.form.valid && htmlOk) {
			let settings: Settings = new Settings();
			settings.aboutPageHtml = this.form.controls.aboutPageHtml.value;
			settings.homePageHtml = this.form.controls.homePageHtml.value;
			settings.cookieSessionMinutes = this.form.controls.cookieSessionMinutes.value;
			settings.unpublishTimeYears = this.form.controls.unpublishTimeYears.value;
			this.subscriptions.add(
				this.settingsService.postSettings(settings).subscribe(settings => {
					let newSettingsList: Settings[] = [];
					newSettingsList.push(settings);
					if (this.settingsList.length >= 10) {
						newSettingsList = [ ...newSettingsList, ... this.settingsList.slice(0, 9)];
					} else {
						newSettingsList = [ ...newSettingsList, ... this.settingsList];
					}
					
					this.settingsList = newSettingsList;
					console.log(JSON.stringify(this.settingsList));
					console.log('Length of new settingsList: ' + this.settingsList.length);
					
					config.duration = 3000;
					this.snackBar.open('Settings saved.', '', config);
				})
			);
		}
	}
}
