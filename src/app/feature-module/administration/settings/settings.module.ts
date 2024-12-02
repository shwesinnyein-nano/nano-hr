import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

import { ChangePasswordComponent } from '../../auth/change-password/change-password.component';

import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';

import { NotificationsComponent } from './notifications/notifications.component';

import { RoleComponent } from './role/role.component';
import { SalarySettingsComponent } from './salary-settings/salary-settings.component';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { TokboxComponent } from './tokbox/tokbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SettingsComponent,
    ChangePasswordComponent,
    InvoiceSettingsComponent,
    NotificationsComponent,
    RoleComponent,
    SalarySettingsComponent,
    ThemeSettingsComponent,
    TokboxComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class SettingsModule {}
