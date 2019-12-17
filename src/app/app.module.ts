import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AddressFormComponent } from './address-form/address-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './component/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { TreeComponent } from './tree/tree.component';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatProgressBarModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

// import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

import {FileUploadModule} from 'ng2-file-upload';

import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminComponent } from './admin/admin.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { NavHorizComponent } from './nav-horiz/nav-horiz.component';
import { ListComponent } from './component/list/list.component';
import { AcademyComponent } from './component/academy/academy.component';
import { SubjectComponent } from './component/subject/subject.component';
import { CourseComponent } from './component/course/course.component';
import { ExamComponent } from './component/exam/exam.component';

@NgModule({
		declarations: [
			AppComponent,
			NavComponent,
			AddressFormComponent,
			TableComponent,
			DashboardComponent,
			TreeComponent,
			DragDropComponent,
			LoginComponent,
			HomeComponent,
			LogoutComponent,
			FileUploadComponent,
			FirstPageComponent,
			NavHorizComponent,
			ListComponent,
			AcademyComponent,
			AdminComponent,
			SubjectComponent,
			CourseComponent,
			ExamComponent
		],
		imports: [
			BrowserModule,
			AppRoutingModule,
			HttpClientModule,
			BrowserAnimationsModule,
			MatSliderModule,
			LayoutModule,
			MatToolbarModule,
			MatButtonModule,
			MatSidenavModule,
			MatIconModule,
			MatListModule,
			MatInputModule,
			MatSelectModule,
			MatRadioModule,
			MatCardModule,
			ReactiveFormsModule,
			MatTableModule,
			MatPaginatorModule,
			MatSortModule,
			MatGridListModule,
			MatMenuModule,
			MatTreeModule,
			MatProgressBarModule,
			DragDropModule,
			// OAuthModule.forRoot()\r\nNgxFileDropModule,
			FileUploadModule,
			FontAwesomeModule,
			FlexLayoutModule,
			FormsModule,
			FontAwesomeModule
		],
		providers: [],
		bootstrap: [
			AppComponent
		]
})
export class AppModule { }
