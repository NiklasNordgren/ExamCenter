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
import { FirstPageComponent } from './first-page/first-page.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "firstPage",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "firstPage",
    component: FirstPageComponent,
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard"
      },
      {
        path: "address-form",
        component: AddressFormComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "drag-drop",
        component: DragDropComponent,
      },
      {
        path: "table",
        component: TableComponent,
      },
      {
        path: "tree",
        component: TreeComponent,
      },
      {
        path: "file-upload",
        component: FileUploadComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
