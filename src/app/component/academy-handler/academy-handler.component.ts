import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;

  constructor(private service: AcademyService, private navigator: Navigator) { }

  ngOnInit() {

    this.service.getAllAcademies().subscribe(responseAcademies => {
      this.convertAndSetAcademies(responseAcademies);
    });
  }

  convertAndSetAcademies(responseAcademies) {
    console.log(responseAcademies);
    
    this.dataSource = new MatTableDataSource<Academy>(responseAcademies);
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

  unpublishSelection(){
    console.log('selected objects: ');
    console.log(this.selection.selected);

    this.service.unpublishAcademies(this.selection.selected, true).subscribe(response => {
      alert('Successfully unpublished: ' + this.selection.selected);
    });
  }
}