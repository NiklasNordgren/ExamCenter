import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { CourseService } from "src/app/service/course.service";
import { SubjectService } from "src/app/service/subject.service";
import { FileService } from "src/app/file.service";

@Component({
  selector: "app-subject",
  templateUrl: "./subject.component.html",
  styleUrls: ["./subject.component.scss"]
})
export class SubjectComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  shortHeader = "Abbreviation";
  name = "Subject";
  data = [];
  url = "/courses/subject/";

  constructor(private route: ActivatedRoute, private service: SubjectService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const academyId = parseInt(params.get("id"), 10);
        this.setSubjetsByAcademyId(academyId);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setSubjetsByAcademyId(academyId) {
    this.service.getAllSubjectsByAcademyId(academyId).subscribe(subjects => {
      this.data = [];
      subjects.forEach(subject => {
        this.data.push({
          name: subject.name,
          shortDesc: subject.code,
          id: subject.id
        });
      });
    });
  }
}
