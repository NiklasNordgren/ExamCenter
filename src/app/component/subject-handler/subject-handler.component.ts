
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'src/app/model/subject.model';
import { SubjectService } from 'src/app/service/subject.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
@Component({
  selector: 'subject-handler',
  templateUrl: 'subject-handler.component.html',
  styleUrls: ['subject-handler.component.scss'],
  providers: [Navigator]
})
export class SubjectHandlerComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'edit'];
  academies = [];
  subjects = [];
  dataSource = [];
  selection = new SelectionModel<Subject>(true, []);
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  public selectedValue: number;

  constructor(private subjectService: SubjectService, 
    private navigator: Navigator, 
    private academyService: AcademyService) { }

  ngOnInit() {
   
    this.dataSource = this.subjects;
    this.academyService.getAllAcademies().subscribe(responseAcademies => {
      this.academies = responseAcademies;
      this.selectedValue = this.academies[0].id;
      this.selectedAcademy(this.selectedValue);
    });
  }

  selectedAcademy(academyId: number){
    
    this.subjectService.getAllSubjectsByAcademyId(academyId).subscribe(responseSubjects => {
      this.subjects = responseSubjects;
      this.dataSource = this.subjects;
    });
  }

  //For the checkboxes 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }
}
