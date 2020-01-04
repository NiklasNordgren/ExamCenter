import {Component, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
 /*
@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss'],
})
export class DialogComponent {
  @Output() valueChange = new EventEmitter<boolean>();
  answer: boolean;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result:` + result);
      this.eventChosen(result);
    });
    
    
  }

  eventChosen(isTrue) {
    
    this.answer = isTrue;
    console.log(this.answer + " @@@");
    this.valueChange.emit(this.answer);
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
}
 */