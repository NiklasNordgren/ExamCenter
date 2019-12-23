  
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnpublishService } from '../service/unpublish.service';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.scss']
})
export class OutboxComponent implements OnInit {

  constructor(private router: Router, private service: UnpublishService) { }

  private subjects = [];

  ngOnInit() {
		this.service.getUnpublishedSubjects().subscribe(responseSubjects => {
			this.convertAndSetSubjects(responseSubjects);
		});
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

}
