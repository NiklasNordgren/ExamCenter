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
import { OutboxComponent } from './component/outbox/outbox.component';


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
			{
				path: 'outbox',
				component: OutboxComponent,
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
