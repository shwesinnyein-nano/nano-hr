import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-ui-alerts',
  templateUrl: './ui-alerts.component.html',
  styleUrl: './ui-alerts.component.scss'
})
export class UiAlertsComponent {
  public routes = routes;
}
