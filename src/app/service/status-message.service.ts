import { Injectable, OnDestroy } from '@angular/core';
import { ConfirmationAckDialogComponent } from '../component/confirmation-ack-dialog/confirmation-ack-dialog.component';
import { MatDialogRef, MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService implements OnDestroy{

  subscriptions: Subscription = new Subscription();
  dialogRef: MatDialogRef<ConfirmationAckDialogComponent>;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog){ }

  ngOnDestroy() {
		this.subscriptions.unsubscribe();
  }
  
  showErrorMessage(title: string, errorMessage: string) {
    this.dialogRef = this.dialog.open(ConfirmationAckDialogComponent, {});
		this.dialogRef.componentInstance.titleMessage = title;
    this.dialogRef.componentInstance.contentMessage = errorMessage;

    const sub = this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;      
		});
		this.subscriptions.add(sub);
  }

	showSuccessMessage(successMessage: string, confirmButtonText: string = '', duration: number = 3000) {
    let config = new MatSnackBarConfig();
    config.duration = duration;
		this.snackBar.open(successMessage, confirmButtonText, config);
  }
  
}
