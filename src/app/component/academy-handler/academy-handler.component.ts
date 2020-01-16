import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-academy-handler',
	styleUrls: ['academy-handler.component.scss'],
	templateUrl: 'academy-handler.component.html',
	providers: [Navigator]
})
export class AcademyHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'edit'];
	academies = [];
	dataSource = new MatTableDataSource<Academy>(this.academies);
	selection = new SelectionModel<Academy>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;

	constructor(private service: AcademyService, private navigator: Navigator) {}

	ngOnInit() {
		const sub = this.service.getAllAcademies().subscribe(responseAcademies => {
			this.convertAndSetAcademies(responseAcademies);
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	convertAndSetAcademies(responseAcademies) {
		this.dataSource = new MatTableDataSource<Academy>(responseAcademies);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}

	unpublishSelection() {
		const sub = this.service
			.unpublishAcademies(this.selection.selected)
			.subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
		this.subscriptions.add(sub);
	}
	onSuccess(data) {
		alert('Successfully unpublished selected academies');
	}
	onError(error) {
		alert('Something went wrong wile trying to unpublish academies.');
	}
}
