import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "src/app/service/exam.service";
import { FileService } from "src/app/file.service";
import { Navigator } from "src/app/util/navigator";
import {
	faExternalLinkAlt,
	IconDefinition
} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-exam",
	templateUrl: "./exam.component.html",
	styleUrls: ["./exam.component.scss"],
	providers: [Navigator]
})
export class ExamComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription = new Subscription();
	name: string = "Filename";
	data: any[] = [];
	icon: IconDefinition = faExternalLinkAlt;
	actionDescription: string = "Open PDF file in new tab";

	constructor(
		private route: ActivatedRoute,
		private service: ExamService,
		private fileService: FileService,
		private navigator: Navigator
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

	setExamsByCourseId(courseId) {
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
}
