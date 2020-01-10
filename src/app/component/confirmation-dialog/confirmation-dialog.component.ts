import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirmation-dialog.component.html',
	styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
	public titleMessage = 'Confirm';
	public contentMessage: string;
	public confirmBtnText = 'Confirm';
	public cancelBtnText = 'Cancel';

	constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}
}
