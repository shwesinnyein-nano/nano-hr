import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './all-employee/employee-list/employee-list.component';
import { EmployeePageContentComponent } from './all-employee/employee-page-content/employee-page-content.component';
import { EmployeeProfileComponent } from './all-employee/employee-profile/employee-profile.component';


import { EmployeesComponent } from './employees.component';



const routes: Routes = [
  {
  path: '',
  component: EmployeesComponent,
  children: [
    { path: "employee-list", component: EmployeeListComponent },
    { path: "employee-page", component: EmployeePageContentComponent },
    { path: "employee-profile", component: EmployeeProfileComponent },
    
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
