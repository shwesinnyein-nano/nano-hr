import { Component } from '@angular/core';
import { routes } from 'src/app/core/core.index';


@Component({
  selector: 'app-ui-images',
  templateUrl: './ui-images.component.html',
  styleUrl: './ui-images.component.scss'
})
export class UiImagesComponent {
  public routes = routes;
}
