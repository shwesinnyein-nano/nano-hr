import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyListComponent } from './company-list.component';
import { CompanyViewComponent } from './company-view/company-view.component';

const routes: Routes =[
{
  path: '',
  component: CompanyListComponent,
  children:[
    {
      path:"company-view", component: CompanyViewComponent
    },
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyListRoutingModule { }
