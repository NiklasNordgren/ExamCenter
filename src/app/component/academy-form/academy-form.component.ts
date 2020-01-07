import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Academy } from '../../model/academy.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AcademyService } from '../../service/academy.service';
import { element } from 'protractor';
import { Navigator } from 'src/app/util/navigator';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-academy-form',
  templateUrl: './academy-form.component.html',
  styleUrls: ['./academy-form.component.scss'],
	providers: [Navigator]
})

export class AcademyFormComponent implements OnInit {
  private form: FormGroup;
  private subscriptions = new Subscription();
  private id: number;
  private academy: Academy;


  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: AcademyService,
		private navigator: Navigator) {  }

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
      this.service.getAcademyById(this.id).subscribe(academy => {
        this.form = this.formBuilder.group({
          abbreviation: academy.abbreviation,
          name: academy.name
        });
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSubmit() {
    if (this.form.valid) {
        this.academy = new Academy();
      }
        if(this.id != 0)
          this.academy.id = this.id;
        this.academy.name = this.form.controls['name'].value;
        this.academy.abbreviation = this.form.controls['abbreviation'].value;
        
        this.service.saveAcademy(this.academy).subscribe(
          data => this.onSuccess(data),
          error => this.onError(error)         
        );
  }

  onSuccess(data: any){
    this.form.reset();
    this.navigator.goToPage('/home/academy-handler');
  }

  onError(error){
    if(error['status'] == 405)
      alert('Error. Check if the name or abbreviation already exists.');
    else{
      alert('Error. Something went wrong while trying to save or edit the academy.');
    }
  }
}
