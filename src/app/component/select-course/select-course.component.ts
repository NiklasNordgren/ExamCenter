import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Academy } from 'src/app/model/academy.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrls: ['./select-course.component.scss']
})
export class SelectCourseComponent implements OnInit {

  myControl = new FormControl();
  academies: Academy[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor() { }

  ngOnInit() {
  }

}
