import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faUser, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { LoginStateShareService } from 'src/app/service/login-state-share.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationAckDialogComponent } from '../confirmation-ack-dialog/confirmation-ack-dialog.component';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	private isLoading = false;
	private form: FormGroup;
	private subscriptions = new Subscription();
	private isLoggedIn;
	faUser = faUser;
	faUnlock = faUnlock;
	dialogRef: MatDialogRef<ConfirmationDialogComponent>;

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private router: Router,
		private loginStateShareService: LoginStateShareService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			username: '',
			password: ''
		});
		this.loginStateShareService.currentLoginState.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	login() {
		const sub = this.loginService.login(this.form.value).subscribe(
			isLoggedIn => this.handleResponse(isLoggedIn),
			error => this.handleError
		);
		this.subscriptions.add(sub);
	}

	handleResponse(isLoggedIn) {
		if (isLoggedIn) {
			this.router.navigate(['/home/']);
			this.changeLoginState(true);
		} else {
			this.form.patchValue({
				password: ''
			});
			this.showErrorDialog("Check if the username or password is incorrect.");
		}
	}

	handleError(error: any) {
		this.showErrorDialog("Check if you have Internet connection.");
	}

	showErrorDialog(message: string){
		this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = "Failed to log in";
		this.dialogRef.componentInstance.contentMessage = message;

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}

	changeLoginState(state: boolean) {
		this.loginStateShareService.changeLoginState(state);
	  }
}
