import { Pipe, PipeTransform } from '@angular/core';
  import { LanguagesService } from './languages.service';
import { errorMM } from './vocabs/error/error-mm';


@Pipe({ name: 'error_translate', pure: false })
export class ErrorTranslatePipe implements PipeTransform {
    errorMessage = errorMM
    constructor(private _languageService: LanguagesService) {
    }

    // transform(key: string) {
    //     console.log("ErrorTranslatePipe==>",key);

    //     if (key) {
    //         let current = this._languageService.getSelectedLanguage();
    //         try {
    //             return current != 'EN' ? this.errorMessage[key as keyof typeof this.errorMessage] || key : key;
    //         } catch (error) {
    //             return key
    //         }
    //     }
    // }
    transform(key: string) {
      console.log("ErrorTranslatePipe==>", key);

      if (key) {
          let current = this._languageService.getSelectedLanguage();
          try {
              return current !== 'EN' ? this.errorMessage[key as keyof typeof this.errorMessage] || key : key;
          } catch (error) {
              return key;
          }
      }

      // Add a default return in case `key` is falsy
      return key;
  }


}
