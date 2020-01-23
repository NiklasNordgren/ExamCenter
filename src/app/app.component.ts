import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AcademyService } from 'src/app/service/academy.service';
import { Router } from '@angular/router';
import {
	MAT_TOOLTIP_DEFAULT_OPTIONS,
	MatTooltipDefaultOptions
} from '@angular/material/tooltip';
import { UserService } from './service/user.service';
import { LoginService } from './service/login.service';
import { LoginStateShareService } from './service/login-state-share.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from './component/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from './component/confirmation-ack-dialog/confirmation-ack-dialog.component';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
	showDelay: 250,
	hideDelay: 50,
	touchendHideDelay: 1000
};

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [
		{
			provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
			useValue: myCustomTooltipDefaults
		}
	]
})
export class AppComponent implements OnInit, OnDestroy {
	constructor(
		private breakpointObserver: BreakpointObserver,
		private service: AcademyService,
		private router: Router,
		private userService: UserService,
		private loginService: LoginService,
		private loginStateShareService: LoginStateShareService,
		private dialog: MatDialog
	) { }
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;
	subscriptions: Subscription = new Subscription();
	academies = [];
	isLoggedIn;
	isHandset$: Observable<boolean> = this.breakpointObserver
		.observe(Breakpoints.Handset)
		.pipe(
			map(result => result.matches),
			shareReplay()
		);

	ngOnInit() {
		const sub = this.service.getAllAcademies().subscribe(responseAcademies => {
			this.convertAndSetAcademies(responseAcademies);
		});
		const subLogin = this.userService.isUserLoggedInAsAdmin().subscribe(isLoggedIn => {
			this.changeLoginState(isLoggedIn);
		});
		const subLoginState = this.loginStateShareService.currentLoginState.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
		this.subscriptions.add(sub);
		this.subscriptions.add(subLogin);
		this.subscriptions.add(subLoginState);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	convertAndSetAcademies(responseAcademies) {
		this.academies = [];
		responseAcademies.forEach(academy => {
			this.academies.push({
				name: academy.name,
				shortDesc: academy.abbreviation,
				id: academy.id
			});
		});
	}

	goToPage(pageName: string) {
		this.router.navigate([`${pageName}`]);
	}
	goToHomePage() {
		this.goToPage('/');
	}

	logoutBtn() {
		this.logout();
	}

	logout() {
		const loginSub = this.loginService.logout().subscribe(
			value => this.handleLogout(),
			error => this.handleError()
		);
		this.subscriptions.add(loginSub);
	}

	handleLogout() {
		this.goToHomePage();
		this.changeLoginState(false);
	}

	handleError() {
		this.showErrorDialog('Something went wrong while logging out. Please try again.');
	}

	changeLoginState(logginState: boolean) {
		this.loginStateShareService.changeLoginState(logginState);
	}

	showErrorDialog(message: string) {
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = 'Error';
		this.dialogRef.componentInstance.contentMessage = message;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}
}
