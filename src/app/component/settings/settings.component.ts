import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingsService } from 'src/app/service/settings.service';
import { Settings } from 'src/app/model/settings.model';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	settings: Observable<Settings>;
	settingsLoaded = false;

	constructor(private settingsService: SettingsService) {}

	ngOnInit() {
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
