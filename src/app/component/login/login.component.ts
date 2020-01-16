import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faUser, faUnlock } from '@fortawesome/free-solid-svg-icons';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	private isLoading = false;
	private form: FormGroup;
	private subscriptions = new Subscription();
	faUser = faUser;
	faUnlock = faUnlock;

	constructor(
		private formBuilder: FormBuilder,
		private loginService: LoginService,
		private router: Router
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			username: '',
			password: ''
		});
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
		if (isLoggedIn) { this.router.navigate(['/home/']); } else {
			this.form.patchValue({
				password: ''
			});
			window.alert('Userename or password is incorrect.');
		}
	}

	handleError(error: any) {
		console.log(error);
	}
}
