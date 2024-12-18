import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { ToasterService } from './core/services/toaster/toaster.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../app/environment/environment';
import { LanguagesService } from './core/services/languages/languages.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireMessagingModule
  ],
  providers: [ToasterService, LanguagesService  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
