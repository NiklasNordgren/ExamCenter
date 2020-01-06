import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Academy } from 'src/app/model/academy.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AcademyService } from 'src/app/service/academy.service';

@Component({
  selector: 'app-academy-form',
  templateUrl: './academy-form.component.html',
  styleUrls: ['./academy-form.component.scss']
})

export class AcademyFormComponent implements OnInit {
  private form: FormGroup;
  private academy: Academy;
  private subscriptions = new Subscription();
 


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: AcademyService ) {

  }
  ngOnInit() {

    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const id = parseInt(params.get('id'), 10);
        this.service.getAcademyById(id);
      })
    );

    this.form = this.formBuilder.group({
      abbreviation: '',
      name: ''
    });
  }

  ngOnDestroy() {

  }
  /*
    ngOnInit() {
      if(this.academy == null){
        console.log("inside edit new");
        
      this.form = this.formBuilder.group({
        abbreviation: '',
        name: ''
      });
    }else {
      console.log("inside else edit");
      
      this.form = this.formBuilder.group({
        abbreviation: this.academy.abbreviation,
        name: this.academy.name
      });
    }
      */

  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
    }
  }

}
