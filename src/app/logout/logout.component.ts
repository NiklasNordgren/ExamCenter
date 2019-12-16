import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

	faSignOutAlt = faSignOutAlt;

	constructor(private router: Router) { }

	ngOnInit() {
	}

	logout() {
		// this.oauthService.logout();
		this.router.navigateByUrl('login');
	}

}
