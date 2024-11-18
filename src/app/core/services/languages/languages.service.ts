import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
export interface Locale {
  lang: string;
  data: any;
}
export interface Langs {
  EN: any,
  TH: any
}
const LOCALIZATION_LOCAL_STORAGE_KEY = 'kbzDefaultLanguage';

@Injectable()
export class LanguagesService {
  langs: Langs = {EN: {}, TH: {}}
  private seletedLanguage = 'EN'
  languageChanged = new Subject()
  constructor(private ngZone: NgZone) {
    this.seletedLanguage = localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) || 'EN'
  }

  loadTranslations(EN: Locale, TH: Locale) {
    this.langs = { EN: EN.data, TH: TH.data }
  }

  setLanguage(lang: string) {
    if (lang) {
      this.seletedLanguage = lang
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
      this.languageChanged.next(null)
    }
  }

  getSelectedLanguage(): string {

    return (
      this.seletedLanguage
    );
  }

  toggleLange() {
    // if(this.seletedLanguage == )
    this.ngZone.run(()=>{
      this.seletedLanguage = this.seletedLanguage == "EN" ? "TH" : "EN"
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, this.seletedLanguage);
      this.languageChanged.next(null)
    })

  }

  transform(value: string) {
    if (value) {
      let current = this.getSelectedLanguage();
      let valueObj = value.split('.')
      if (valueObj.length == 2) {
        try {
          return this.langs[current as keyof Langs][valueObj[0]][valueObj[1]]
        } catch (error) {
          return "Can't Translate Data"
        }
      }
    }
    return value
  }
}
