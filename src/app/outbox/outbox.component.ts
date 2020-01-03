  
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnpublishService } from '../service/unpublish.service';
import { faFileMedical, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {

  constructor(private router: Router, private service: UnpublishService) { }

  faFileMedical = faFileMedical;
  faTrash = faTrash;

  private subjects = [];
  private exams = [];
  private displayedColumns: string[] = [ 'filename', 'date', 'unpublishDate', 'actions'];

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

	deleteExam(element: any) {
		this.service.deleteExam(element.id);
		this.exams = this.exams.filter(x => x.id != element.id);
	}
}
