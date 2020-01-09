import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { faFileMedical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UnpublishService } from "../../service/unpublish.service";
import { ConfirmationDialog } from "../confirmation-dialog/confirmation-dialog";
import { Subscription } from "rxjs";

// https://stackoverflow.com/questions/43751187/how-to-enable-swipe-gesture-to-move-to-next-tab-for-tabs-module-in-angular-mater

@Component({
	selector: "app-outbox",
	templateUrl: "./outbox.component.html",
	styleUrls: ["./outbox.component.scss"]
})
export class OutboxComponent implements OnInit, OnDestroy {
	subscriptions: Subscription = new Subscription();
	dialogRef: MatDialogRef<ConfirmationDialog>;

	faFileMedical = faFileMedical;
	faTrash = faTrash;

	subjects = [];
	exams = [];
	clickedId: number;
	displayedColumns: string[] = ["filename", "date", "unpublishDate", "actions"];

	constructor(
		private router: Router,
		private service: UnpublishService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		const sub = this.service.getUnpublishedExams().subscribe(responseExams => {
			this.convertAndSetExams(responseExams);
		});
		this.subscriptions.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	convertAndSetSubjects(responseSubjects) {
		this.subjects = [];
		responseSubjects.forEach(subject => {
			this.subjects.push({
				name: subject.name,
				code: subject.code,
				id: subject.id,
				unpublished: subject.unpublished,
				academyId: subject.academyId
			});
		});
	}

	convertAndSetExams(responseExams) {
		this.exams = [];
		responseExams.forEach(exam => {
			this.exams.push({
				filename: exam.filename,
				date: exam.date,
				unpublishDate: exam.unpublishDate,
				id: exam.id,
				unpublished: exam.unpublished,
				courseId: exam.courseId
			});
		});
	}

	publishExam(element: any) {
		this.service.publishExam(element);
		this.exams = this.exams.filter(x => x.id != element.id);
	}

	openDeleteDialog(element: any) {
		this.clickedId = element.id;
		this.dialogRef = this.dialog.open(ConfirmationDialog, {});
		this.dialogRef.componentInstance.confirmMessage =
			"Are you sure you want to delete?";
		this.dialogRef.componentInstance.titleMessage = "Confirm";
		this.dialogRef.componentInstance.confirmBtnText = "Delete";

		const sub = this.dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.service.deleteExam(this.clickedId);
				this.exams = this.exams.filter(x => x.id != this.clickedId);
			}
			this.dialogRef = null;
		});
		this.subscriptions.add(sub);
	}
}
