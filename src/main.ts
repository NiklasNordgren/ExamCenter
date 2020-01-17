import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Observable } from "rxjs";
import { setup, track, printSubscribers } from "observable-profiler";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import "hammerjs";

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));

setup(Observable);
platformBrowserDynamic([])
	.bootstrapModule(AppModule)
	.then(ref => {
		track();
		(window as any).stopProfiler = () => {
			ref.destroy();
			const subscribers = track(false);
			printSubscribers({
				subscribers
			});
		};
	})
	.catch(err => console.error(err));
