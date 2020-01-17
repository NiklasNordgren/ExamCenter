import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faUser, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { LoginStateShareService } from 'src/app/service/login-state-share.service';

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

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private router: Router,
		private loginStateShareService: LoginStateShareService
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
			window.alert('Userename or password is incorrect.');
		}
	}

	handleError(error: any) {
		console.log(error);
	}

	changeLoginState(state: boolean) {
		this.loginStateShareService.changeLoginState(state);
	  }
}
