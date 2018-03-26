import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {D3Component} from "./d3/d3.component";
import {Information} from "./app.component.service";
import {DemoGroupIvgContainer} from "./Common/demo-group-ivg-container.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  Form: FormGroup;
  @ViewChild('child1') child1: D3Component;
  @ViewChild('child2') child2: D3Component;

  container: DemoGroupIvgContainer;

  constructor(public service: Information) {
  }

  ngOnInit() {

    this.service.container.subscribe((data) => {
      this.container = data;
    });

    this.Form = new FormGroup({
      'xCoo': new FormControl(null),
      'yCoo': new FormControl(null),
      'height': new FormControl(null),
      'width': new FormControl(null)
    });

    this.Form.disable();
  }

  ButtonClicked1(type) {
    this.child1.ButtonClicked(type);
  }

  ButtonClicked2(type) {
    this.child2.ButtonClicked(type);
  }

  exitFunc() {
    this.child1.exitFunc();
  }
}
