import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-ui-accordion',
  templateUrl: './ui-accordion.component.html',
  styleUrl: './ui-accordion.component.scss'
})
export class UiAccordionComponent {
  public routes = routes;
}
