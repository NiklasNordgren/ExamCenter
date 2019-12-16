import { Component, OnInit, Input } from '@angular/core';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';

@Component({
  selector: 'app-select-exam-properties',
  templateUrl: './select-exam-properties.component.html',
  styleUrls: ['./select-exam-properties.component.scss']
})
export class SelectExamPropertiesComponent implements OnInit {

  @Input() academies: Academy[];
  @Input() academyNames: string[];

  constructor() { }

  ngOnInit() {
    
  }

}
