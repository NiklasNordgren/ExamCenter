import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "src/app/service/exam.service";
import { FileService } from "src/app/file.service";
import {
	faExternalLinkAlt,
	faInfoCircle,
	faWindowClose,
	IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { CourseService } from "src/app/service/course.service";
import { Course } from "src/app/model/course.model";

@Component({
	selector: "app-exam",
	templateUrl: "./exam.component.html",
	styleUrls: ["./exam.component.scss"]
})
export class ExamComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	name: string = "Filename";
	data: any[] = [];
	icon: IconDefinition = faExternalLinkAlt;
	faInfoCircle: IconDefinition = faInfoCircle;
	faWindowClose: IconDefinition = faWindowClose;
	actionDescription: string = "Open PDF file in new tab";
	course: Course;
	courseLoaded: boolean = false;
	showingInfoMessage: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private service: ExamService,
		private fileService: FileService,
		private courseService: CourseService,
		private changeDetector: ChangeDetectorRef
	) {}

	ngOnInit() {
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

	setExamsByCourseId(courseId: number) {
		const sub = this.service
			.getAllExamsByCourseId(courseId)
			.subscribe(exams => {
				this.data = [];
				exams.forEach(exam => {
					this.data.push({
						id: exam.filename,
						name: exam.filename,
						shortDesc: ""
					});
					this.courseService.getCourseById(courseId).subscribe(course => {
						this.course = course;
						this.courseLoaded = true;
						this.changeDetector.detectChanges();
					});
				});
			});
		this.subscriptions.add(sub);
	}

	openPdf(row) {
		const filename = row.id;
		const sub = this.fileService.downloadFile(filename).subscribe(pdfBlob => {
			const fileURL = URL.createObjectURL(pdfBlob);
			window.open(fileURL, "_blank");
		});
		this.subscriptions.add(sub);
	}

	toggleInfoMessage() {
		if (this.showingInfoMessage) {
			this.showingInfoMessage = false;
			this.changeDetector.detectChanges();
		} else {
			this.showingInfoMessage = true;
			this.changeDetector.detectChanges();
		}
	}
}
