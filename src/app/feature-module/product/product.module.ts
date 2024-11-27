import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { CarListComponent } from './product-car/car-list/car-list.component';
import { LanguageModule } from 'src/app/core/services/languages/languages.modules';
import { AddCarModalComponent } from './product-car/add-car-modal/add-car-modal.component';


@NgModule({
  declarations: [
    ProductComponent,
    CarListComponent,
    AddCarModalComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    
    FormsModule,
    ReactiveFormsModule,
    LanguageModule,

    // MatTableModule,
    // MatSortModule,
    SharedModule
  ]
})
export class ProductModule { }
