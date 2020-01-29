import { Component, OnInit, OnDestroy, SecurityContext, ElementRef, ViewChild } from "@angular/core";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";
import { faCog, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Settings } from "src/app/model/settings.model";
import { DomSanitizer } from "@angular/platform-browser";
import { StatusMessageService } from 'src/app/service/status-message.service';

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
	form: FormGroup;
	selectedValue: Settings;

	constructor(
		private settingsService: SettingsService,
		private formBuilder: FormBuilder,
		private sanitizer: DomSanitizer,
		private statusMessageService: StatusMessageService
	) { }

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

	chooseSetting(setting: Settings) { }

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
		let message = "";
		let difference = "";
		if (!this.safeHtml(homePageHtml)) {
			difference = this.getHtmlDifference(
				this.sanitizeUnescape(homePageHtml),
				homePageHtml
			);
			message += this.getDifferenceErrorMessage("Home", difference);
			htmlOk = false;
		}
		if (!this.safeHtml(aboutPageHtml)) {
			difference = this.getHtmlDifference(
				this.sanitizeUnescape(aboutPageHtml),
				aboutPageHtml
			);
			message += this.getDifferenceErrorMessage("About", difference);
			htmlOk = false;
		}
		if (!htmlOk) {
			this.statusMessageService.showErrorMessage("Error saving Settings", message);
		} else if (this.form.valid && htmlOk) {
			if (this.form.controls.cookieSessionMinutes.value < 5) {
				this.statusMessageService.showErrorMessage("Error saving Settings", "The cookie session length cannot be shorter than 5 minutes.");
			} else {
				let settings: Settings = this.getNewSettingsFromForm();
				this.subscriptions.add(
					this.settingsService.postSettings(settings).subscribe(settings => {
						this.setNewSettingsList(settings);
						this.statusMessageService.showSuccessMessage("Settings saved.");
						this.selectedValue = settings;
					})
				);
			}
		}
	}

	private getNewSettingsFromForm() {
		let settings = new Settings();
		settings.aboutPageHtml = this.form.controls.aboutPageHtml.value;
		settings.homePageHtml = this.form.controls.homePageHtml.value;
		settings.cookieSessionMinutes = this.form.controls.cookieSessionMinutes.value;
		settings.unpublishTimeYears = this.form.controls.unpublishTimeYears.value;
		return settings;
	}

	private setNewSettingsList(settings: Settings) {
		let newSettingsList: Settings[] = [];
		newSettingsList.push(settings);
		if (this.settingsList.length >= 10) {
			newSettingsList = [...newSettingsList, ...this.settingsList.slice(0, 9)];
		} else {
			newSettingsList = [...newSettingsList, ...this.settingsList];
		}
		this.settingsList = newSettingsList;
	}

	private sanitizeHtml(html: string) {
		return this.sanitizer.sanitize(SecurityContext.HTML, html);
	}

	private sanitizeUnescape(html: string) {
		return new DOMParser()
			.parseFromString(this.sanitizeHtml(html), "text/html")
			.querySelector("body").innerHTML;
	}

	private safeHtml(html: string) {
		return html === this.sanitizeUnescape(html);
	}

	private getHtmlDifference(rawHtml: string, sanitizedHtml: string) {
		var i = 0;
		var j = 0;
		var result = "";

		while (j < sanitizedHtml.length) {
			if (rawHtml[i] != sanitizedHtml[j] || i == rawHtml.length)
				result += sanitizedHtml[j];
			else i++;
			j++;
		}
		return result;
	}

	private getDifferenceErrorMessage(pageName: string, difference: string) {
		let message = `${pageName} page HTML code has incorrect syntax or was deemed unsafe.\n`;
		if (difference.length > 0) {
			message += `The potential security hazards or syntax errors found were:\n${difference}\n`;
		}
		return message;
	}
}
