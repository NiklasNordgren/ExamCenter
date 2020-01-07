import { Component, OnInit } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from 'src/app/service/subject.service';
import { AcademyService } from 'src/app/service/academy.service';
import { Subject } from 'src/app/model/subject.model';

@Component({
  selector: 'app-course-handler',
  templateUrl: './course-handler.component.html',
  styleUrls: ['./course-handler.component.scss']
})
export class CourseHandlerComponent implements OnInit {

  private academies: Academy[];
  private subjects: Subject[];
  private form: FormGroup;
  private subscriptions = new Subscription();
  private id: number;
  dataSource = new MatTableDataSource<any>();

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private service: SubjectService, private academyService: AcademyService) { }

  ngOnInit() {
    //If id = 0, it specifies a new subject.
    this.form = this.formBuilder.group({
      academy: '',
      code: '',
      name: ''
    });
    //If id != 0, it specifies editing a subject. Here's how we find the subject in question.
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.id = parseInt(params.get('id'), 10);
        this.handleId();
      })
    );
   
    //Get all the academies for the dropdownlist of academies. When creating a new subject.
    //Try this :) // NN
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
    });


    this.dataSource = new MatTableDataSource<Subject>(this.subjects);
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
    });
  }
  onDestroy(){
    this.subscriptions.unsubscribe();
  }
  
  handleId() {
    if (this.id != 0) {
      this.service.getSubjectById(this.id).subscribe(subject => {
        this.form = this.formBuilder.group({
          academy: subject.academyId,
          code: subject.code,
          name: subject.name
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
    }
  }
  selectedAcademy(academyId: number){
    this.service.getAllSubjectsByAcademyId(academyId).subscribe(responseSubjects => {
      this.subjects = responseSubjects;
      this.dataSource = new MatTableDataSource<Subject>(this.subjects);
    });
  }
}
