import { Component } from '@angular/core';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-confirmation-ack-dialog',
  templateUrl: './confirmation-ack-dialog.component.html',
  styleUrls: ['./confirmation-ack-dialog.component.scss']
})
export class ConfirmationAckDialogComponent extends ConfirmationDialogComponent{

  titleMessage = "Error";
  confirmBtnText = 'Okay';
}
