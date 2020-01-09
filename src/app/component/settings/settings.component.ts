import { Component, OnInit } from "@angular/core";
import { SettingsService } from "src/app/service/settings.service";
import { Settings } from "src/app/model/settings.model";
import { Observable } from "rxjs";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
	settings: Observable<Settings>;
	settingsLoaded: boolean = false;

	constructor(private settingsService: SettingsService) {}

	ngOnInit() {
		this.settingsService.getSettings().subscribe(settings => {
			this.settings = settings;
			this.settingsLoaded = true;
		});
	}
}
