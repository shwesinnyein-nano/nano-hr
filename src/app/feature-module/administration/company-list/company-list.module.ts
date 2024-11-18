import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyListRoutingModule } from './company-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyListComponent } from './company-list.component';
import { CompanyViewComponent } from './company-view/company-view.component';
import { RouterModule } from '@angular/router';
import { AddCompanyModalComponent } from './add-company-modal/add-company-modal.component';


@NgModule({
  declarations: [
    CompanyListComponent,
    CompanyViewComponent,
    AddCompanyModalComponent


  ],
  imports: [
    CommonModule,
    CompanyListRoutingModule,
    SharedModule,





  ]
})
export class CompanyListModule { }
