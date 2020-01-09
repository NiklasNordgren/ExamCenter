import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Navigator } from "src/app/util/navigator";
import { Exam } from "../../model/exam.model";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "../../service/exam.service";
import { CourseService } from "src/app/service/course.service";
import { Course } from "src/app/model/course.model";

export interface customBooleanArray {
	value: boolean;
	viewValue: string;
}

@Component({
	selector: "app-address-form",
	templateUrl: "./exam-form.component.html",
	styleUrls: ["./exam-form.component.scss"],
	providers: [Navigator]
})
export class ExamFormComponent implements OnInit, OnDestroy {
	boolean: customBooleanArray[] = [
		{ value: false, viewValue: "False" },
		{ value: true, viewValue: "True" }
	];

	form: FormGroup;
	subscriptions: Subscription = new Subscription();

	FORM_TYPE = { CREATE: 0 };
	isCreateForm: boolean;
	exam: Exam = new Exam();
	id: number;

	isUnpublishedSelector = false;
	courses: Course[];
	titleText: string;
	buttonText: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private service: ExamService,
		private courseService: CourseService,
		private navigator: Navigator
	) {}

	ngOnInit() {
		this.form = this.formBuilder.group({
			filename: "",
			date: "",
			unpublishDate: "",
			unpublished: "",
			course: ""
		});

		const sub = this.courseService.getAllCourses().subscribe(responseResult => {
			this.courses = responseResult;
		});
		this.subscriptions.add(sub);

		this.subscriptions.add(
			this.route.paramMap.subscribe(params => {
				this.id = parseInt(params.get("id"), 10);
				this.createForm(this.id);
			})
		);
	}

	createForm(id: number) {
		if (id == this.FORM_TYPE.CREATE) {
			this.isCreateForm = true;
			this.setCreateFormText();
		} else {
			this.isCreateForm = false;
			this.setEditFormText();
			const sub = this.service.getExamById(id).subscribe(exam => {
				this.exam = exam;
				this.isUnpublishedSelector = exam.unpublished;
				this.form = this.formBuilder.group({
					filename: exam.filename,
					date: exam.date,
					unpublishDate: exam.unpublishDate,
					unpublished: exam.unpublished,
					course: exam.courseId
				});
			});
			this.subscriptions.add(sub);
		}
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	onSubmit() {
		if (this.form.valid) {
			if (this.isCreateForm) {
				this.exam = new Exam();
			}
			this.exam.filename = this.form.controls["filename"].value;
			this.exam.date = this.form.controls["date"].value;
			this.exam.unpublishDate = this.form.controls["unpublishDate"].value;
			this.exam.unpublished = this.form.controls["unpublished"].value;
			this.exam.courseId = this.form.controls["course"].value;

			const sub = this.service.saveExam(this.exam).subscribe(e => {});
			this.subscriptions.add(sub);
			this.form.reset();
		}
	}

	setCreateFormText() {
		this.titleText = "Create Exam";
		this.buttonText = "Create";
	}

	setEditFormText() {
		this.titleText = "Edit Exam";
		this.buttonText = "Save";
	}
}
