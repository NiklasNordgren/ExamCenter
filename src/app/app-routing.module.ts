import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileUploadComponent } from './component/file-upload/file-upload.component';
import { AcademyComponent } from './component/academy/academy.component';
import { AdminHandlerComponent } from "./component/admin/admin-handler/admin-handler.component";

import { Academy } from './model/academy.model';
import { CourseComponent } from './component/course/course.component';
import { Course } from './model/course.model';
import { Subject } from 'rxjs';
import { SubjectComponent } from './component/subject/subject.component';
import { Exam } from './model/exam.model';
import { ExamComponent } from './component/exam/exam.component';
import { AboutComponent } from './component/about/about.component';
import { LoginComponent } from './component/login/login.component';
import { AcademyHandlerComponent } from './component/academy/academy-handler/academy-handler.component';
import { SubjectHandlerComponent } from './component/subject/subject-handler/subject-handler.component';
import { CourseHandlerComponent } from './component/course/course-handler/course-handler.component';
import { ExamHandlerComponent } from './component/exam/exam-handler/exam-handler.component';
import { AcademyFormComponent } from './component/academy/academy-form/academy-form.component';
import { OutboxComponent } from './component/outbox/outbox.component';
import { AdminGuard } from './guard/admin.guard';
import { SearchResultComponent } from './component/search/search-result/search-result.component';
import { CourseFormComponent } from './component/course/course-form/course-form.component';
import { SubjectFormComponent } from './component/subject/subject-form/subject-form.component';
import { ExamFormComponent } from './component/exam/exam-form/exam-form.component';
import { AdminFormComponent } from './component/admin/admin-form/admin-form.component';
import { SettingsComponent } from './component/settings/settings.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'academy',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'academy',
		component: AcademyComponent,
		data: Academy
	},
	{
		path: 'search/:searchString',
		component: SearchResultComponent,
		data: String
	},
	{
		path: 'subjects/academy/:id',
		component: SubjectComponent,
		data: Subject
	},
	{
		path: 'courses/subject/:id',
		component: CourseComponent,
		data: Course
	},
	{
		path: 'exams/course/:id',
		component: ExamComponent,
		data: Exam
	},
	{
		path: 'admin',
		canActivate: [AdminGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'file-upload'
			},
			{
				path: 'settings',
				component: SettingsComponent
			},
			{
				path: 'academy-handler',
				component: AcademyHandlerComponent
			},
			{
				path: 'academy-form/:id',
				component: AcademyFormComponent
			},
			{
				path: 'subject-handler',
				component: SubjectHandlerComponent
			},
			{
				path: 'course-handler',
				component: CourseHandlerComponent
			},
			{
				path: 'subject-form/:id',
				component: SubjectFormComponent
			},
			{
				path: 'course-form/:id',
				component: CourseFormComponent
			},
			{
				path: 'exam-handler',
				component: ExamHandlerComponent
			},
			{
				path: 'exam-form/:id',
				component: ExamFormComponent
			},
			{
				path: 'admin-form/:id',
				component: AdminFormComponent
			},
			{
				path: 'file-upload',
				component: FileUploadComponent
			},
			{
				path: "admin-handler",
				component: AdminHandlerComponent
			},
			{
				path: 'outbox',
				component: OutboxComponent
			},
			{
				path: 'app-settings',
				component: SettingsComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
