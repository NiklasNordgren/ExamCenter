import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { User } from '../model/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';

export interface customBooleanArray {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
  providers: [Navigator]
})
export class AdminFormComponent implements OnInit {

  boolean: customBooleanArray[] = [
    {value: false, viewValue: 'False'},
    {value: true, viewValue: 'True'}
  ];

  private form: FormGroup;
  private subscriptions = new Subscription();

  FORM_TYPE = {CREATE: 0}
  isCreateForm: boolean;
  user: User = new User();
  id: number;
  
  isSuperUserSelector = false;
  titleText: string;
  buttonText: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: UserService, private navigator: Navigator) {

  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      isSuperUser: ''
    });
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id'), 10);
        this.createForm(this.id);
      })
    );
  }

  createForm(id: number) {
    if (id == this.FORM_TYPE.CREATE) {
      this.isCreateForm = true;
      this.setCreateFormText();
    } else {
      this.isCreateForm = false;
      this.setEditFormText();
      this.service.getUserById(id).subscribe(user => {
        this.user = user;
        this.isSuperUserSelector = user.isSuperUser;
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
      if (this.isCreateForm) {
        this.user = new User();
      }
        this.user.name = this.form.controls['name'].value;
        this.user.isSuperUser = this.form.controls['isSuperUser'].value;
        
        this.service.saveUser(this.user).subscribe(e => {
        });   

      this.form.reset();
    }
  }

  setCreateFormText() {
    this.titleText = "Create Admin"
    this.buttonText = "Create";
  }

  setEditFormText() {
    this.titleText = "Edit Admin";
    this.buttonText = "Save";
  }

}
