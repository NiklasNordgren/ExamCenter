import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss']
})
export class ConfirmationDialog {
    
    public confirmMessage: string;
    public titleMessage: string;
    public confirmBtnText: string;
    public cancelBtnText: string;

    constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) {}

    
}