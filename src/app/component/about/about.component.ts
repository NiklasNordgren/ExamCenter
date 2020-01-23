import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { SettingsService } from "../../service/settings.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-about",
	templateUrl: "./about.component.html",
	styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	aboutPageHtml: string;

	constructor(
		private sanitizer: DomSanitizer,
		private settingsService: SettingsService
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.settingsService.getAboutPageHtml().subscribe(aboutPageHtml => {
				this.aboutPageHtml = this.sanitizer.sanitize(
					SecurityContext.HTML,
					aboutPageHtml
				);
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
