import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FileUploadModule } from "ng2-file-upload";
import { OutboxComponent } from "./component/outbox/outbox.component";
import { ConfirmationDialog } from "./component/confirmation-dialog/confirmation-dialog";
import { MatDialogModule } from "@angular/material";
import {
	HammerGestureConfig,
	HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { MatTabsModule } from "@angular/material/tabs";
import { TestSwipeComponent } from "./component/test-swipe/test-swipe.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AdminComponent } from "./admin/admin.component";
import { NavHorizComponent } from "./nav-horiz/nav-horiz.component";
import { ListComponent } from "./component/list/list.component";
import { AcademyComponent } from "./component/academy/academy.component";
import { SubjectComponent } from "./component/subject/subject.component";
import { CourseComponent } from "./component/course/course.component";
import { ExamComponent } from "./component/exam/exam.component";
import { AboutComponent } from "./about/about.component";
import { LoginComponent } from "./component/login/login.component";
import { AcademyHandlerComponent } from "./component/academy-handler/academy-handler.component";
import { SubjectHandlerComponent } from "./component/subject-handler/subject-handler.component";
import { CourseHandlerComponent } from "./component/course-handler/course-handler.component";
import { ExamHandlerComponent } from "./component/exam-handler/exam-handler.component";
import { AcademyFormComponent } from "./component/academy-form/academy-form.component";
import { SearchResultComponent } from "./component/search-result/search-result.component";
import { SearchComponent } from "./component/search/search.component";
import { AdminFormComponent } from './admin-form/admin-form.component';
import { SubjectFormComponent } from './component/subject-form/subject-form.component';



@NgModule({
	declarations: [
		AppComponent,
		NavHorizComponent,
		ListComponent,
		AcademyComponent,
		AdminComponent,
		SubjectComponent,
		CourseComponent,
		ExamComponent,
		AboutComponent,
		AcademyHandlerComponent,
		SubjectHandlerComponent,
		CourseHandlerComponent,
		ExamHandlerComponent,
		AcademyFormComponent,
		AppComponent,
		NavHorizComponent,
		ListComponent,
		AcademyComponent,
		AdminComponent,
		SubjectComponent,
		CourseComponent,
		ExamComponent,
		AboutComponent,
		OutboxComponent,
		ConfirmationDialog,
		TestSwipeComponent,
		SearchResultComponent,
		SearchComponent,
		AdminFormComponent,
    	SubjectFormComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		// OAuthModule.forRoot()\r\nNgxFileDropModule,
		FileUploadModule,
		FontAwesomeModule,
		FontAwesomeModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		// OAuthModule.forRoot()\r\nNgxFileDropModule,
		FileUploadModule,
		FontAwesomeModule,
		FontAwesomeModule,
		MatDialogModule,
		MatTabsModule
	],
	entryComponents: [ConfirmationDialog],
	providers: [
		{ provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig }
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
