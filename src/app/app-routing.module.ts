import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressFormComponent } from './address-form/address-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TableComponent } from './component/table/table.component';
import { TreeComponent } from './tree/tree.component';
import { HomeComponent } from './home/home.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AcademyComponent } from './component/academy/academy.component';
import { AdminComponent } from './admin/admin.component';
import { Academy } from './model/academy.model';
import { CourseComponent } from './component/course/course.component';
import { Course } from './model/course.model';
import { Subject } from 'rxjs';
import { SubjectComponent } from './component/subject/subject.component';
import { Exam } from './model/exam.model';
import { ExamComponent } from './component/exam/exam.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './component/login/login.component';
import { AcademyHandlerComponent } from './component/academy-handler/academy-handler.component';
import { SubjectHandlerComponent } from './component/subject-handler/subject-handler.component';
import { CourseHandlerComponent } from './component/course-handler/course-handler.component';
import { ExamHandlerComponent } from './component/exam-handler/exam-handler.component';
import { AcademyFormComponent } from './component/academy-form/academy-form.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'academy',
		pathMatch: 'full',
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
		path: 'home',
		component: HomeComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'dashboard'
			},
			{
				path: 'academy-handler',
				component: AcademyHandlerComponent,
			},
			{
				path: 'academy-form/:id',
				component: AcademyFormComponent,
			},
			{
				path: 'subject-handler',
				component: SubjectHandlerComponent,
			},
			{
				path: 'course-handler',
				component: CourseHandlerComponent,
			},
			{
				path: 'exam-handler',
				component: ExamHandlerComponent,
			},
			{
				path: 'address-form',
				component: AddressFormComponent,
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'drag-drop',
				component: DragDropComponent,
			},
			{
				path: 'table',
				component: TableComponent,
			},
			{
				path: 'tree',
				component: TreeComponent,
			},
			{
				path: 'file-upload',
				component: FileUploadComponent,
			},
			{
				path: 'admin',
				component: AdminComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
