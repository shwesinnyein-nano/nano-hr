import { Component,ViewEncapsulation } from '@angular/core';
import { Router, Event as RouterEvent, NavigationStart } from '@angular/router';
import { CommonService } from './shared/common/common.service';
import { url } from './core/core.index';
import { LanguagesService } from './core/services/languages/languages.service';
import { locale as enLang } from './core/services/languages/vocabs/en';
import { locale as thLang } from './core/services/languages/vocabs/th';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent {
  title = 'template';
  base = '';
  page = '';
  last = '';

  constructor(
    private common: CommonService,
    private router: Router,
    private _languageService: LanguagesService
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.router.events.subscribe((data: RouterEvent) => {
      // console.log('base',this.base);
      // console.log('page',this.page);
      // console.log('last',this.last);
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    })
    this._languageService.loadTranslations(
      enLang,
      thLang
    )
  }

  public getRoutes(events: url) {
    const splitVal = events.url.split('/');
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  }
}
