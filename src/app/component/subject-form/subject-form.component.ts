import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { Subject } from '../../model/subject.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';

export interface customAcademyArray {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
  providers: [Navigator]
})
export class SubjectFormComponent implements OnInit {

  academyArray: Array<customAcademyArray> = [];

  private form: FormGroup;
  private subscriptions = new Subscription();

  FORM_TYPE = {CREATE: 0}
  isCreateForm: boolean;
  subject: Subject = new Subject();
  
  academyIdSelector = 0;
  titleText: string;
  buttonText: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: SubjectService, private academyService: AcademyService,private navigator: Navigator) {

  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      code: '',
      academyId: ''
    });
    this.getAcademies();
    console.log(this.academyArray);
    
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.createForm(parseInt(params.get('id'), 10));
      })
    );
  }

  getAcademies() {
    this.academyService.getAllAcademies().subscribe(academies => {
      for (let academy of academies) {
        this.academyArray.push({value: academy.id, viewValue: academy.name});
      }
    });
  }

  createForm(id: number) {
    

    if (id == this.FORM_TYPE.CREATE) {
      this.isCreateForm = true;
      this.setCreateFormText();
    } else {
      this.isCreateForm = false;
      this.setEditFormText();
      this.service.getSubjectById(id).subscribe(subject => {
        this.subject = subject;
        this.academyIdSelector = subject.academyId;
        this.form = this.formBuilder.group({
          name: subject.name,
          code: subject.code,
          academyId: subject.academyId
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
        this.subject = new Subject();
      }
        this.subject.name = this.form.controls['name'].value;
        this.subject.code = this.form.controls['code'].value;
        this.subject.academyId = this.form.controls['academyId'].value;

        this.service.saveSubject(this.subject).subscribe(e => {
        });   

      this.form.reset();
    }
  }

  setCreateFormText() {
    this.titleText = "Create Subject"
    this.buttonText = "Create";
  }

  setEditFormText() {
    this.titleText = "Edit Subject";
    this.buttonText = "Save";
  }

}