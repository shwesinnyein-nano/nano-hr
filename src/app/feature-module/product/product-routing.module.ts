import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product.component';
import { CarListComponent } from './product-car/car-list/car-list.component';
import { AddCarModalComponent } from './product-car/add-car-modal/add-car-modal.component';
const routes: Routes = [
  {
  path: '',
  component: ProductComponent,
  children: [
    { path: "car-list", component: CarListComponent },
    { path: "add-car-modal", component: AddCarModalComponent },
    
  ],
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
