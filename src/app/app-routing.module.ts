import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressFormComponent } from './address-form/address-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TableComponent } from './table/table.component';
import { TreeComponent } from './tree/tree.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AdminComponent } from './admin/admin.component';
import { Academy } from './model/academy.model';
import { AcademyComponent } from './component/academy/academy.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'academy/:id',
		component: AcademyComponent,
		data: Academy
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
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
