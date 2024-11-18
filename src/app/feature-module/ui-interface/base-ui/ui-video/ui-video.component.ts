import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-ui-video',
  templateUrl: './ui-video.component.html',
  styleUrl: './ui-video.component.scss'
})
export class UiVideoComponent {
  public routes = routes;
}
