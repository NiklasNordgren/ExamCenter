import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Academy } from 'src/app/model/academy.model';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { AcademyService } from 'src/app/service/academy.service';

@Component({
  selector: 'app-select-academy',
  templateUrl: './select-academy.component.html',
  styleUrls: ['./select-academy.component.scss']
})
export class SelectAcademyComponent extends FormControl implements OnInit {

  @Input() academies: Academy[];

  @Output() selectedAcademyOutput = new EventEmitter<string>();

  selectedAcademy: Academy;
  filteredOptions: Observable<string[]>;

  constructor() {
    super();
  }

  ngOnInit() { }

  public setSelectedAcademy(academyId: number): void {
    this.academies.forEach(a => {
      if (a.id == academyId)
        this.selectedAcademy = a;
    });
    console.log(this.selectedAcademy);
  }

}
