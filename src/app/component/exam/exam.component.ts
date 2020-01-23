import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "src/app/service/exam.service";
import { FileService } from "src/app/service/file.service";
import {
	faExternalLinkAlt,
	faInfoCircle,
	faWindowClose,
	IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { CourseService } from "src/app/service/course.service";
import { Course } from "src/app/model/course.model";
import { StatusMessageService } from 'src/app/service/status-message.service';

@Component({
	selector: "app-exam",
	templateUrl: "./exam.component.html",
	styleUrls: ["./exam.component.scss"]
})
export class ExamComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	name = "Filename";
	data: any[] = [];
	icon: IconDefinition = faExternalLinkAlt;
	faInfoCircle: IconDefinition = faInfoCircle;
	faWindowClose: IconDefinition = faWindowClose;
	actionDescription = "Open PDF file in new tab";
	course: Course;
	showingInfoMessage = false;
	courseId;
	shortHeader: string = "";

	constructor(
		private route: ActivatedRoute,
		private service: ExamService,
		private fileService: FileService,
		private courseService: CourseService,
		private changeDetector: ChangeDetectorRef,
		private statusMessageService: StatusMessageService
	) {}

	ngOnInit() {
		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.courseId = parseInt(params.get("id"), 10);
				this.getCourseById(this.courseId);
				this.setExamsByCourseId(this.courseId);
			})
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	getCourseById(courseId) {
		this.subscriptions.add(
			this.courseService.getCourseById(courseId).subscribe(course => {
				this.course = course;
				this.changeDetector.detectChanges();
			})
		);
	}

	setExamsByCourseId(courseId: number) {
		const sub = this.service.getAllExamsByCourseId(courseId).subscribe(
			exams => this.onSuccess(exams, courseId),
			error => this.onError(error)
		);

		this.subscriptions.add(sub);
	}

	onSuccess(exams, courseId) {
		this.data = [];
		exams.forEach(exam => {
			this.data.push({
				id: exam.filename,
				name: exam.filename,
				shortDesc: "",
			});
		});
	}
	onError(error) {
		this.statusMessageService.showErrorMessage("Error", "An error has occured while loading data.")
	}

	openPdf(row) {
		const filename = row.id;
		const sub = this.fileService.downloadFile(filename).subscribe(pdfBlob => {
			const fileURL = URL.createObjectURL(pdfBlob);
			window.open(fileURL, "_blank");
		},
		error => {
			this.statusMessageService.showErrorMessage("Error", "Could not open PDF.");
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
