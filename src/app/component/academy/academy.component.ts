import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";
import { StatusMessageService } from "src/app/service/status-message.service";

@Component({
	selector: "app-academy",
	templateUrl: "./academy.component.html",
	styleUrls: ["./academy.component.scss"]
})
export class AcademyComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	homePageHtml: string;

	constructor(
		private sanitizer: DomSanitizer,
		private settingsService: SettingsService,
		private statusMessage: StatusMessageService
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.settingsService.getHomePageHtml().subscribe(
				homePageHtml => {
					this.homePageHtml = this.sanitizer.sanitize(
						SecurityContext.HTML,
						homePageHtml
					);
				},
				err => {
					this.statusMessage.showErrorMessage(
						"Server error",
						"Could not load page content. Please contact the maintainers of the site."
					);
				}
			)
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
