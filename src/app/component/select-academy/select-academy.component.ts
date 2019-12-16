import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AcademyService } from 'src/app/service/academy.service';
import { Academy } from 'src/app/model/academy.model';
import { startWith, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-select-academy',
  templateUrl: './select-academy.component.html',
  styleUrls: ['./select-academy.component.scss']
})
export class SelectAcademyComponent implements OnInit {

  @Input() academies: Academy[];

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor() { }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getIdFromSelectedAcademy(): number{

    return 1;
  }

  isSelectedAcademyValid(): boolean{
    
    return false;
  }

}
