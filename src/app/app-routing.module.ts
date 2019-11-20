import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressFormComponent } from './address-form/address-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TableComponent } from './table/table.component';
import { TreeComponent } from './tree/tree.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MatInput } from '@angular/material/input';


const routes: Routes = [
  /*
  {
    path: '**',
    component: HomeComponent,
    //TODO: PageNotFoundComponent
  },
  */
  {
    path: "",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
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
        component: TableComponent,
      },
      {
        path: "tree",
        component: TreeComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
