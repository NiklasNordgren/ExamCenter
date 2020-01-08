import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginService } from "src/app/service/login.service";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy{
	private isLoading = false;
	private form: FormGroup;
	private subscriptions = new Subscription();
	
	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private router: Router
	) {	}

	ngOnInit(){
		this.form = this.formBuilder.group({
			username: '',
			password: ''
		  });
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	  }
	

	login() {
		this.loginService.login(this.form.value).subscribe(
			isLoggedIn => this.handleResponse(isLoggedIn),
			error => this.handleError
		)
	}

	handleResponse(isLoggedIn) {
		if (isLoggedIn) this.router.navigate(["/home/admin"]);
		else window.alert("Userename or password is incorrect.");
	}

	handleError(error: any) {
		console.log(error);
	}
}
