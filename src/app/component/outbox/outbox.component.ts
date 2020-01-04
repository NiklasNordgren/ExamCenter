  
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faFileMedical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { UnpublishService } from '../../service/unpublish.service';


@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {

  constructor(private router: Router, private service: UnpublishService, private matDialog: MatDialog) { }

  faFileMedical = faFileMedical;
  faTrash = faTrash;

  subjects = [];
  exams = [];
  displayedColumns: string[] = [ 'filename', 'date', 'unpublishDate', 'actions'];

  ngOnInit() {
		this.service.getUnpublishedExams().subscribe(responseExams => {
			console.log(responseExams);
			
			this.convertAndSetExams(responseExams);
		});
		// this.displayedColumns = [ 'Filename', 'code', 'actions'];
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

	deleteE(isTrue) {
		console.log(isTrue);
		
	}

	deleteExam(element: any) {
	

		const dialogRef = this.matDialog.open(DialogContentExampleDialog);

		
	
		dialogRef.afterClosed().subscribe(result => {
		  console.log(`Dialog result: ${result}`);
		});
	  


	//	this.service.deleteExam(element.id);
	//	this.exams = this.exams.filter(x => x.id != element.id);
	}
}

@Component({
	selector: 'dialog-content',
	templateUrl: 'dialog-content.html',
  })
  export class DialogContentExampleDialog {
	  @Output() valueUpdated = new EventEmitter();

	  valueUpdate(isYes) {
		this.valueUpdated.emit(isYes);
	  }
  }
