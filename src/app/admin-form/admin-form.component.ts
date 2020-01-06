import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from '../model/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { element } from 'protractor';

@Component({
  selector: 'app-address-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss']
})
export class AdminFormComponent implements OnInit {
  private form: FormGroup;
  private subscriptions = new Subscription();
  private id: number;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: UserService) {

  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      isSuperUser: ''
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
        console.log(user);
        
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
      this.createUser();
      this.form.reset();
    }
  }

  createUser() {
    let user = new User();
    user.name = this.form.controls['name'].value;
    user.isSuperUser = this.form.controls['isSuperUser'].value;
    
    this.service.saveUser(user).subscribe(e => {
    });
  }
}
