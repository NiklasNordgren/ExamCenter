import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Academy } from 'src/app/model/academy.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-subject',
  templateUrl: './select-subject.component.html',
  styleUrls: ['./select-subject.component.scss']
})
export class SelectSubjectComponent implements OnInit {

  myControl = new FormControl();
  academies: Academy[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor() { }

  ngOnInit() {
  }

}
