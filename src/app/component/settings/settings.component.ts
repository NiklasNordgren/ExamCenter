import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";
import { faCog, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Settings } from "src/app/model/settings.model";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";

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
		
		let htmlOk = true;
		let message = '';
		console.log(homePageHtml);
		
		if (!this.safeHtml(homePageHtml)) {
			message += 'Home page HTML code was deemed unsafe.\n';
			htmlOk = false;
		}
		if (!this.safeHtml(aboutPageHtml)) {
			message += 'About page HTML was deemed unsafe.';
			htmlOk = false;
		}
		if (!htmlOk) {
			this.snackBar.open(message.trim(), "OK");
		} else if (this.form.valid && htmlOk) {
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
						newSettingsList = [
							...newSettingsList,
							...this.settingsList.slice(0, 9)
						];
					} else {
						newSettingsList = [...newSettingsList, ...this.settingsList];
					}
					this.settingsList = newSettingsList;

					let config = new MatSnackBarConfig();
					config.duration = 3000;
					this.snackBar.open("Settings saved.", "", config);
				})
			);
		}
	}

	private sanitizeHtml(html: string) {
		return this.sanitizer.sanitize(SecurityContext.HTML, html);
	}

	private unescape(escapedString: string) {
		return new DOMParser().parseFromString(escapedString,'text/html').querySelector('body').innerHTML;
	}

	private safeHtml(html: string) {
		return html === this.unescape(this.sanitizeHtml(html));
	}

}
