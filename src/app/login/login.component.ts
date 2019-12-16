import { Component } from '@angular/core';
// import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
// import { authConfig } from '../sso.config';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoginService } from '../service/login.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {

	private checkoutForm;
	private isLoading = false;

	constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
		this.checkoutForm = this.formBuilder.group({
			email: '',
			password: ''
		});
	}

	login(loginData) {
		this.isLoading = true;
		this.loginService.login(loginData).subscribe(
			(isLoggedIn) => this.handleResponse(isLoggedIn),
			error => this.handleError,
			() => {
				this.isLoading = false;
			});
	}

	handleResponse(isLoggedIn) {
		if (isLoggedIn) {
			window.alert('You have successfully logged in!');
		} else {
			window.alert('Email or password is incorrect.');
		}
	}

	handleError(error: any) {
		console.log(error);
	}
}
