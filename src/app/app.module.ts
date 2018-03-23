import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { D3Component } from './d3/d3.component';
import {Information} from "./app.component.service";


@NgModule({
  declarations: [
    AppComponent,
    D3Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Information],
  bootstrap: [AppComponent]
})
export class AppModule {
}
