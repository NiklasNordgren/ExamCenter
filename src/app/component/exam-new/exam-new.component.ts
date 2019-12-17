import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "src/app/service/exam.service";
import { FileService } from "src/app/file.service";

@Component({
  selector: "app-exam-new",
  templateUrl: "./exam-new.component.html",
  styleUrls: ["./exam-new.component.scss"]
})
export class ExamNewComponent implements OnInit {
  private subscriptions = new Subscription();
  name = "Filename";
  data = [];
  url = "/download/";

  constructor(
    private route: ActivatedRoute,
    private service: ExamService,
    private fileService: FileService
  ) {}

  ngOnInit() {
    console.log("Exam new");
    
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const courseId = parseInt(params.get("id"), 10);
        this.setExamsByCourseId(courseId);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setExamsByCourseId(courseId) {
    this.service.getAllExamsByCourseId(courseId).subscribe(exams => {
      this.data = [];
      exams.forEach(exam => {
        console.log(exam.fileName);

        this.data.push({
          id: exam.fileName,
          name: exam.fileName,
          shortDesc: ""
        });
      });
    });
  }

  openPdf(row) {
    console.log("Row: " + row);
    console.log("Row class: " + row.class);
    let fileName = row.id;
    this.fileService.downloadFile(fileName).subscribe(pdfBlob => {
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL, "_blank");
    });
  }
}
