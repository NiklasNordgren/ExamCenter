import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginService } from "src/app/service/login.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { faUser, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { LoginStateShareService } from "src/app/service/login-state-share.service";
import { StatusMessageService } from "src/app/service/status-message.service";

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
	isLoading = false;
	form: FormGroup;
	isLoggedIn;
	faUser = faUser;
	faUnlock = faUnlock;

	private subscriptions = new Subscription();

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private router: Router,
		private loginStateShareService: LoginStateShareService,
		private statusMessageService: StatusMessageService
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			username: "",
			password: ""
		});
		this.loginStateShareService.currentLoginState.subscribe(
			isLoggedIn => (this.isLoggedIn = isLoggedIn)
		);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	login() {
		const sub = this.loginService.login(this.form.value).subscribe(
			isLoggedIn => this.handleResponse(isLoggedIn),
			// error => this.handleError(error)
		);
		this.subscriptions.add(sub);
	}

	handleResponse(isLoggedIn) {
		if (isLoggedIn) {
			this.statusMessageService.showSuccessMessage("Successfully logged in.");
			this.router.navigate(["/admin/"]);
			this.changeLoginState(true);
		} else {
			this.form.patchValue({
				password: ""
			});
			this.showErrorDialog("Check if the username or password is incorrect.");
		}
	}

	handleError(error) {
		let errorMessage = '';
		if (error.status === 404) {
			errorMessage = 'Username or password is incorrect.';
		} else {
			errorMessage = "An unknown error occured.";
		}
		this.showErrorDialog(errorMessage);
	}

	showErrorDialog(message: string) {
		this.statusMessageService.showErrorMessage("Login failed", message);
	}

	changeLoginState(state: boolean) {
		this.loginStateShareService.changeLoginState(state);
	}
}
