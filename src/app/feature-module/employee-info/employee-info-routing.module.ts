import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeInfoComponent } from './employee-info.component';
import { EmployeeInfoListComponent } from './employee-info-list/employee-info-list.component';
import { EmployeeProfileInfoComponent } from './employee-profile-info/employee-profile-info.component';
import { EmployeInfoViewComponent } from './employe-info-view/employe-info-view.component';


const routes: Routes = [
  {
  path: '',
  component: EmployeeInfoComponent,
  children: [
    { path: "employee-info-list", component: EmployeeInfoListComponent },

    { path: "employee-profile-info", component: EmployeeProfileInfoComponent },
    { path: "employee-info-view", component: EmployeInfoViewComponent}
    
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeInfoRoutingModule { }
