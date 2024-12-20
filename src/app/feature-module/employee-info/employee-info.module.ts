import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeInfoRoutingModule } from './employee-info-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LanguageModule } from 'src/app/core/services/languages/languages.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeInfoComponent } from './employee-info.component';
import { EmployeeInfoListComponent } from './employee-info-list/employee-info-list.component';
import { EmployeeProfileInfoComponent } from './employee-profile-info/employee-profile-info.component';
import { EmployeInfoViewComponent } from './employe-info-view/employe-info-view.component';


@NgModule({
  declarations: [
    EmployeeInfoComponent,
    EmployeeInfoListComponent,
    EmployeeProfileInfoComponent,
    EmployeInfoViewComponent,
   
  ],
  imports: [
    CommonModule,
    EmployeeInfoRoutingModule,
    SharedModule,
    LanguageModule,
    FormsModule,
    ReactiveFormsModule,
    
  ]
})
export class EmployeeInfoModule { }
