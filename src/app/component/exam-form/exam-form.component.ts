import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Navigator } from 'src/app/util/navigator';
import { Exam } from '../../model/exam.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../service/exam.service';
import { AcademyService } from 'src/app/service/academy.service';

export interface customAcademyArray {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.scss'],
  providers: [Navigator]
})
export class ExamFormComponent implements OnInit {

  academyArray: Array<customAcademyArray> = [];

  private form: FormGroup;
  private subscriptions = new Subscription();

  FORM_TYPE = {CREATE: 0}
  isCreateForm: boolean;
  exam: Exam = new Exam();
  
  academyIdSelector = 0;
  titleText: string;
  buttonText: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private service: ExamService, private academyService: AcademyService,private navigator: Navigator) {

  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: '',
      date: '',
      unpublishDate: '',
      isUnpublished: ''
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
      this.service.getExamById(id).subscribe(exam => {
        this.exam = exam;
     //   this.academyIdSelector = exam.academyId;
        this.form = this.formBuilder.group({
          filename: exam.filename,
          date: exam.date,
          unpublishDate: exam.unpublishDate,
          isUnpublished: exam.unpublished
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
        this.exam = new Exam();
      }
        this.exam.filename = this.form.controls['filename'].value;
        this.exam.date = this.form.controls['date'].value;
        this.exam.unpublishDate = this.form.controls['date'].value;
        this.exam.unpublished = this.form.controls['isUnpublished'].value;

        this.service.saveExam(this.exam).subscribe(e => {
        });   

      this.form.reset();
    }
  }

  setCreateFormText() {
    this.titleText = "Create Exam"
    this.buttonText = "Create";
  }

  setEditFormText() {
    this.titleText = "Edit Exam";
    this.buttonText = "Save";
  }

}
