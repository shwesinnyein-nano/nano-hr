import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';

@Component({
  selector: 'app-ui-badges',
  templateUrl: './ui-badges.component.html',
  styleUrl: './ui-badges.component.scss'
})
export class UiBadgesComponent {
  public routes = routes;
}
