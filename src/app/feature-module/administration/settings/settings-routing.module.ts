import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';


import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { RoleComponent } from './role/role.component';
;
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { SalarySettingsComponent } from './salary-settings/salary-settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChangePasswordComponent } from '../../auth/change-password/change-password.component';

import { TokboxComponent } from './tokbox/tokbox.component';


const routes: Routes = [
  {
    path:"",
    component:SettingsComponent,
    children:[
      
      {
        path:"theme-settings",
        component:ThemeSettingsComponent
      },
      
      {
        path:"role",
        component:RoleComponent
      },
      
      {
        path:"invoice-settings",
        component:InvoiceSettingsComponent
      },
      {
        path:"salary-settings",
        component:SalarySettingsComponent
      },
      {
        path:"notifications",
        component:NotificationsComponent
      },
      
      {
        path:"tokbox-settings",
        component:TokboxComponent
      },
      
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
