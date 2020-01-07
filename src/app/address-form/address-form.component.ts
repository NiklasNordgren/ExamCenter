import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../model/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { element } from 'protractor';

@Component({
	selector: 'app-address-form',
	templateUrl: './address-form.component.html',
	styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
	private form: FormGroup;
	private subscriptions = new Subscription();
	private id: number;
  
  
	constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: UserService) {
  
	}
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
  
	  if (this.id != 0) {
		this.service.getUserById(this.id).subscribe(user => {
  
		  this.form = this.formBuilder.group({
			name: user.name,
			isSuperUser: user.isSuperUser
		  });
		});
	  }
	}
	ngOnDestroy() {
	  this.subscriptions.unsubscribe();
	}
  
	onSubmit() {
	  if (this.form.valid) {
		console.log("Form Submitted!");
		this.form.reset();
	  }
	}
  }
  