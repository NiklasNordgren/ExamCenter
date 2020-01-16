import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { SettingsService } from "src/app/service/settings.service";
import { Subscription } from "rxjs";

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
		private settingsService: SettingsService
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.settingsService.getCurrentSettings().subscribe(settings => {
				this.homePageHtml = this.sanitizer.sanitize(SecurityContext.HTML, settings.homePageHtml);
			})
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
}
