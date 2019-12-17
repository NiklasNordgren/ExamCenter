import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';

@Component({
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

	login() {
		this.isLoading = true;		
		this.loginService.login(this.checkoutForm.value).subscribe(
			(isLoggedIn) => this.handleResponse(isLoggedIn),
			error => this.handleError,
			() => {
				this.isLoading = false;
			});
	}

	handleResponse(isLoggedIn) {
		if (isLoggedIn)
			window.alert("You have successfully logged in!");
		else
			window.alert("Email or password is incorrect.");
	}

	handleError(error: any) {
		console.log(error);
	}

	tryToSendForm(){
		if(this.checkoutForm.valid){
			this.login();
			this.checkoutForm.reset();
		}
	}

}