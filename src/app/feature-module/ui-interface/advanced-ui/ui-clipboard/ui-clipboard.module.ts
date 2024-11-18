import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiClipboardRoutingModule } from './ui-clipboard-routing.module';
import { UiClipboardComponent } from './ui-clipboard.component';
import { SharedModule } from 'primeng/api';


@NgModule({
  declarations: [
    UiClipboardComponent
  ],
  imports: [
    CommonModule,
    UiClipboardRoutingModule,
    SharedModule
  ]
})
export class UiClipboardModule { }
