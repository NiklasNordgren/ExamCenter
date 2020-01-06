import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Academy } from '../../model/academy.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AcademyService } from '../../service/academy.service';
import { element } from 'protractor';

@Component({
  selector: 'app-academy-form',
  templateUrl: './academy-form.component.html',
  styleUrls: ['./academy-form.component.scss']
})

export class AcademyFormComponent implements OnInit {
  private form: FormGroup;
  private subscriptions = new Subscription();
  private id: number;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: AcademyService) {

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
      console.log("Form Submitted!");
      this.form.reset();
    }
  }
}
