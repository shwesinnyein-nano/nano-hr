import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationViewComponent } from './configuration-view/configuration-view.component';
import { ConfigurationComponent } from './configuration.component';
import { AddConfigurationComponent } from './add-configuration/add-configuration.component';
import { LanguageModule } from 'src/app/core/services/languages/languages.modules';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomPaginationModule } from 'src/app/feature-module/common/custom-pagination/custom-pagination.module';
@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationViewComponent,
    AddConfigurationComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    LanguageModule,
    SharedModule,
    CustomPaginationModule
  ]
})
export class ConfigurationModule { }
