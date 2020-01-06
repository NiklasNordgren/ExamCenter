import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Academy } from '../../model/academy.model';
import { AcademyService } from '../../service/academy.service';
import { Navigator } from '../../util/navigator';

@Component({
  selector: 'academy-handler',
  styleUrls: ['academy-handler.component.scss'],
  templateUrl: 'academy-handler.component.html',
  providers: [Navigator]
})
export class AcademyHandlerComponent {
  displayedColumns: string[] = ['select', 'name', 'edit'];
  private academies = [];
  dataSource = new MatTableDataSource<Academy>(this.academies);
  selection = new SelectionModel<Academy>(true, []);

  constructor(private service: AcademyService, private navigator: Navigator) { }

  ngOnInit() {

    this.service.getAllAcademies().subscribe(responseAcademies => {
      this.convertAndSetAcademies(responseAcademies);

    });
  }

  convertAndSetAcademies(responseAcademies) {
    this.academies = [];
    responseAcademies.forEach(academy => {
      this.academies.push({
        name: academy.name,
        shortDesc: academy.abbreviation,
        id: academy.id
      });
    });
    this.dataSource = new MatTableDataSource<Academy>(this.academies);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}