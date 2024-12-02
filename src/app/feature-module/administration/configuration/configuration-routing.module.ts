import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationViewComponent } from './configuration-view/configuration-view.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurationComponent,
    children:[
      {
        path:"configuration-view", component: ConfigurationViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
