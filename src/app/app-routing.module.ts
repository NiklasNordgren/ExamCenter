import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressFormComponent } from './address-form/address-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TableComponent } from './table/table.component';
import { TreeComponent } from './tree/tree.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '*', 
    redirectTo: "login"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "address-form",
    component: AddressFormComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "drag-drop",
    component: DragDropComponent
  },
  {
    path: "table",
    component: TableComponent
  },
  {
    path: "tree",
    component: TreeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
