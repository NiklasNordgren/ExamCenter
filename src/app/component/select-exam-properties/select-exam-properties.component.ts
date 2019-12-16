import { Component, OnInit } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';

@Component({
  selector: 'app-select-exam-properties',
  templateUrl: './select-exam-properties.component.html',
  styleUrls: ['./select-exam-properties.component.scss']
})
export class SelectExamPropertiesComponent implements OnInit {

  academies: Academy[] = [];

  constructor(private academyService: AcademyService) { }

  ngOnInit() {
    this.academyService.getAllAcademies().subscribe(a => {
      this.academies = a;
    })
  }

}
