import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-ui-typography',
  templateUrl: './ui-typography.component.html',
  styleUrl: './ui-typography.component.scss'
})
export class UiTypographyComponent {
  public routes = routes;
}
