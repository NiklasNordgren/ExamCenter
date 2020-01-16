import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'src/app/model/subject.model';
import { SubjectService } from 'src/app/service/subject.service';
import { Navigator } from 'src/app/util/navigator';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Academy } from 'src/app/model/academy.model';
import { AcademyService } from 'src/app/service/academy.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-subject-handler',
	templateUrl: 'subject-handler.component.html',
	styleUrls: ['subject-handler.component.scss'],
	providers: [Navigator]
})
export class SubjectHandlerComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	displayedColumns: string[] = ['select', 'name', 'edit'];
	academies = [];
	subjects = [];
	dataSource = new MatTableDataSource<Subject>(this.academies);
	selection = new SelectionModel<Subject>(true, []);
	faPlus = faPlus;
	faPen = faPen;
	faTrash = faTrash;
	public selectedValue: number;

	constructor(
		private subjectService: SubjectService,
		private navigator: Navigator,
		private academyService: AcademyService
	) {}

	ngOnInit() {
		this.dataSource = new MatTableDataSource<Subject>(this.subjects);
		const sub = this.academyService
			.getAllAcademies()
			.subscribe(responseAcademies => {
				this.academies = responseAcademies;
				this.selectedValue = this.academies[0].id;
				this.selectedAcademy(this.selectedValue);
			});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	selectedAcademy(academyId: number) {
		const sub = this.subjectService
			.getAllPublishedSubjectsByAcademyId(academyId)
			.subscribe(responseSubjects => {
				this.subjects = responseSubjects;
				this.dataSource = new MatTableDataSource<Subject>(this.subjects);
			});
		this.subscriptions.add(sub);
	}

	// For the checkboxes
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
		const sub = this.subjectService
			.unpublishSubjects(this.selection.selected)
			.subscribe(
				data => this.onSuccess(data),
				error => this.onError(error)
			);
		this.subscriptions.add(sub);
	}
	onSuccess(data) {
		alert('Successfully unpublished selected subjects');
	}
	onError(error) {
		this.selection.clear();
		alert('Something went wrong wile trying to unpublish subjects.');
	}
}
