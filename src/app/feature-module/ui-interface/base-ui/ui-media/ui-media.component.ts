import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-ui-media',
  templateUrl: './ui-media.component.html',
  styleUrl: './ui-media.component.scss'
})
export class UiMediaComponent {
  public routes = routes;
}
