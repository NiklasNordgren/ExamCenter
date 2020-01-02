import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class Navigator {
	constructor(private router: Router) {}

	/**
   * Go to the specified page. The IP-adress is already known, so the pageName
   * should only include the paths that come after the website address.
   * @param pageName The path to the page to navigate to.
   */
	public goToPage(pageName: string) {
		console.log('Navigator was called');

		this.router.navigate([`${pageName}`]);
	}
}
