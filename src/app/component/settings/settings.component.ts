import { Component, OnInit, OnDestroy, SecurityContext, ElementRef, ViewChild } from "@angular/core";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";
import { faCog, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Settings } from "src/app/model/settings.model";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationAckDialogComponent } from "../confirmation-ack-dialog/confirmation-ack-dialog.component";
import { MatDialogRef, MatDialog } from "@angular/material";

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
	dialogRef: MatDialogRef<ConfirmationAckDialogComponent>;

	constructor(
		private settingsService: SettingsService,
		private formBuilder: FormBuilder,
		private snackBar: MatSnackBar,
		private sanitizer: DomSanitizer,
		private dialog: MatDialog
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
			this.openAcknowledgeDialog(message, "Error saving Settings");
		} else if (this.form.valid && htmlOk) {
			let settings: Settings = this.getNewSettingsFromForm();
			this.subscriptions.add(
				this.settingsService.postSettings(settings).subscribe(settings => {
					this.setNewSettingsList(settings);

					let config = new MatSnackBarConfig();
					config.duration = 3000;
					this.snackBar.open("Settings saved.", "", config);
					this.selectedValue = this.settingsList[0];
				})
			);
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

	private openAcknowledgeDialog(errorMessage: string, title: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = title;
		this.dialogRef.componentInstance.contentMessage = errorMessage;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	private getDifferenceErrorMessage(pageName: string, difference: string) {
		let message = `${pageName} page HTML code has incorrect syntax or was deemed unsafe.\n`;
		if (difference.length > 0) {
			message += `The potential security hazards or syntax errors found were:\n${difference}\n`;
		}
		return message;
	}
}
