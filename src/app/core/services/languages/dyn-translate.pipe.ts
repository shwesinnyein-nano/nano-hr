import { Pipe, PipeTransform } from '@angular/core';
import { LanguagesService } from './languages.service';



@Pipe({ name: 'dyn_translate', pure: false })
export class DynTranslatePipe implements PipeTransform {

  constructor(private _languageService: LanguagesService) {
  }

  // transform(value: string, valueMM: string) {
  //   if (value) {
  //     let current = this._languageService.getSelectedLanguage();
  //     try {
  //       return current == "EN" ? value : valueMM ||value
  //     } catch (error) {
  //       return value
  //     }
  //   }
  // }
  transform(value: string, valueTH: string) {
    if (value) {
      let current = this._languageService.getSelectedLanguage();
      try {
        return current === "EN" ? value : valueTH || value;
      } catch (error) {
        return value;
      }
    }

    // Add a return value for the case when `value` is falsy
    return valueTH || value;
  }


}
