import { Component, OnInit, Input } from '@angular/core';
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
export class SelectAcademyComponent implements OnInit {

  @Input() academies: Academy[];
  @Input() options: string[];

  selectedAcademy: Academy;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(private academyService: AcademyService) { }

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

  setSelectAcademy(event: any): void{
    this.academies.forEach(a => {
      if(a.name === event.option.value)
        this.selectedAcademy = a;
    });
    console.log(this.selectedAcademy);
  }

  isSelectedAcademyValid(): boolean{
    
    return false;
  }

}
