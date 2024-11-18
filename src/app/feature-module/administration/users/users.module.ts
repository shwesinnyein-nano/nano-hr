import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserViewComponent } from './user-view/user-view.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { LanguageModule } from 'src/app/core/services/languages/languages.modules';


@NgModule({
  declarations: [
    UsersComponent,
    UserViewComponent,
    AddUserModalComponent

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    LanguageModule
  ]
})
export class UsersModule { }
