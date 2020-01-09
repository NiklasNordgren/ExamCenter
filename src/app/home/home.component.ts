import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AcademyService } from '../service/academy.service';
import { Academy } from '../model/academy.model';
import { faUsersCog, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	faUsersCog = faUsersCog;
	faUpload = faUpload;
	faTrash = faTrash;
	academies: Academy[] = [];
	isSuperUser: boolean;

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	constructor(
		private breakpointObserver: BreakpointObserver,
		private router: Router,
		private academyService: AcademyService,
		private userService: UserService
	) { }

	ngOnInit() {

		this.academyService.getAllAcademies().subscribe(academies => {
			this.academies = academies;
		});

		this.userService.isUserLoggedInAsSuperUser().subscribe(isSuperUser => {
			console.log(isSuperUser);
			this.isSuperUser = Boolean(isSuperUser);
		});

	}

	logout() {
		// this.oauthService.logout();
		this.router.navigateByUrl('login');
	}

}
