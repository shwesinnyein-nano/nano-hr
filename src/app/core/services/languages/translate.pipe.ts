import { Pipe, PipeTransform } from '@angular/core';
import { Langs, LanguagesService } from '../languages/languages.service';


@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {

  constructor(private _languageService: LanguagesService) {
  }

  transform(value: string) {

    if (value) {
      let current = this._languageService.getSelectedLanguage();

      let valueObj = value.split('.')

      if (valueObj.length >= 2) {
        try {

          return this._languageService.langs[current as keyof Langs][valueObj[0]][valueObj[1]] || valueObj[1]
        } catch (error) {
          return valueObj[1]
        }
      }
    }
    return value
  }

}
