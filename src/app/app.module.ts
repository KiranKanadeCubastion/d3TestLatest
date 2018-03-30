import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { D3Component } from './d3/d3.component';
import {DemoAdvanced2Service} from "./demo-advanced2.service";


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
  providers: [DemoAdvanced2Service],
  bootstrap: [AppComponent]
})
export class AppModule {
}
