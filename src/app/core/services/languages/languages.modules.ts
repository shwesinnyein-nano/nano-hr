import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynTranslatePipe } from "./dyn-translate.pipe";
import { TranslatePipe } from "./translate.pipe";
import { ErrorTranslatePipe } from "./error-translate.pipe";

@NgModule({
imports:[CommonModule,FormsModule],
declarations:[TranslatePipe,DynTranslatePipe,ErrorTranslatePipe],
exports:[TranslatePipe,DynTranslatePipe,ErrorTranslatePipe],
providers:[TranslatePipe,ErrorTranslatePipe,DynTranslatePipe]
})
export class LanguageModule{

}