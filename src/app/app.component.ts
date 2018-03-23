import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {D3Component} from "./d3/d3.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  Form: FormGroup;
  @ViewChild('child') child: D3Component;
  

  constructor() {
  }

  ngOnInit() {

    this.Form = new FormGroup({
      'xCoo': new FormControl(null),
      'yCoo': new FormControl(null),
      'height': new FormControl(null),
      'width': new FormControl(null)
    });

    this.Form.disable();
  }

  ButtonClicked(type) {
    this.child.ButtonClicked(type);
    }

  exitFunc() {
    this.child.exitFunc();
  }
}
