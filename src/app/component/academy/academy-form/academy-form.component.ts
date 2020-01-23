import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Academy } from '../../../model/academy.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AcademyService } from '../../../service/academy.service';
import { Navigator } from 'src/app/util/navigator';
import { StatusMessageService } from 'src/app/service/status-message.service';

@Component({
	selector: 'app-academy-form',
	templateUrl: './academy-form.component.html',
	styleUrls: ['./academy-form.component.scss'],
	providers: [Navigator]
})
export class AcademyFormComponent implements OnInit, OnDestroy {
	form: FormGroup;
	id: number;
	academy: Academy = new Academy();
	createFormId: number = 0;

	private subscriptions = new Subscription();

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private service: AcademyService,
		public navigator: Navigator,
		private statusMessageService: StatusMessageService
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			abbreviation: '',
			name: ''
		});
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get('id'), 10);
				this.handleId();
			})
		);
	}

	handleId() {
		if (this.id !== this.createFormId) {
			const sub = this.service.getAcademyById(this.id).subscribe(academy => {
				this.form = this.formBuilder.group({
					abbreviation: academy.abbreviation,
					name: academy.name
				});
			});
			this.subscriptions.add(sub);
		}
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			if (this.id !== this.createFormId) {
				this.academy.id = this.id;
			}
			this.academy.name = this.form.controls.name.value;
			this.academy.abbreviation = this.form.controls.abbreviation.value;
	
			const sub = this.service.saveAcademy(this.academy).subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
			this.subscriptions.add(sub);
		}
		
	}

	onSuccess(data: any) {
		this.form.reset();
		this.navigator.goToPage('/admin/academy-handler');
		this.openAcknowledgeDialog(data.name + " was " + ((this.id == this.createFormId) ? "created" : "updated"), 'success');
	}

	onError(error) {
		if (error.status === 401) {
			this.openAcknowledgeDialog('Not athorized. Please log in and try again', 'error');
			this.navigator.goToPage('/login');
		} else if (error.status === 409) {
			this.openAcknowledgeDialog('The name already exists as an academy.', 'error');
		} else {
			this.openAcknowledgeDialog('Something went wrong while trying to save the academy.', 'error');
		}
	}

	openAcknowledgeDialog(errorMessage: string, typeText: string) {
		this.statusMessageService.showErrorMessage(typeText, errorMessage);
	}
}
