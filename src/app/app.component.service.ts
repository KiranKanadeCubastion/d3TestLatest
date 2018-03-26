import {DemoGroupIvgContainer} from "./Common/demo-group-ivg-container.model";
import {DemoGroupIvgSection} from "./Common/demo-group-ivg-section.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
export class Information {

  container = new BehaviorSubject<DemoGroupIvgContainer>(this.getData());

  constructor() {


  }

  public getData() {
    const container = new DemoGroupIvgContainer();
    container.id = '101';
    container.type_cd = '1';
    container.bg_color = '#888800';
    container.alpha = 1;
    container.height = '100';
    container.active = true;
    container.sections = [];
    container.sections.push(new DemoGroupIvgSection(
      '201',
      'section201',
      '100',
      '100',
      '#000000',
      true,
      [{
        'id': 'new_record',
        'name': 'section201',
        'type_cd': 'Image',
        'width': 30, // percentage
        'height': 30, // percentage
        'alpha': 1,
        'x_coordinate': 10,
        'y_coordinate': 10,
        'section_id': '0',
        'index': 0,
        'att_id': '',
        'att_name': '',
        'thumbnail_att_id': '',
        'thumbnail_att_name': '',
        'desc_text': '',
        'desc_text_font_name': '',
        'desc_text_font_style': '',
        'desc_text_font_size': 0,
        'desc_text_font_color': '',
        'active': true,
        'moveEnabled': false
      }]
    ));

    container.sections.push(new DemoGroupIvgSection(
      '202',
      'section202',
      '100',
      '100',
      '#000000',
      true,
      [{
        'id': 'new_record',
        'name': 'section202',
        'type_cd': 'Image',
        'width': 30, // percentage
        'height': 30, // percentage
        'alpha': 1,
        'x_coordinate': 10,
        'y_coordinate': 10,
        'section_id': '0',
        'index': 0,
        'att_id': '',
        'att_name': '',
        'thumbnail_att_id': '',
        'thumbnail_att_name': '',
        'desc_text': '',
        'desc_text_font_name': '',
        'desc_text_font_style': '',
        'desc_text_font_size': 0,
        'desc_text_font_color': '',
        'active': true,
        'moveEnabled': false
      }]
    ));

    return container;
  }/*

  variable: any = 0;

  info: any[] = [
    {
      type: 1,
      index: 0,
      height: 23,
      width: 30,
      xCoordinate: 50,
      yCoordinate: 50
    },
    {
      type: 2,
      index: 1,
      height: 30,
      width: 30,
      xCoordinate: 10,
      yCoordinate: 10
    },
    {
      type: 3,
      index: 2,
      height: 30,
      width: 30,
      xCoordinate: 50,
      yCoordinate: 20
    },
    {
      type: 4,
      index: 3,
      height: 30,
      width: 30,
      xCoordinate: 50,
      yCoordinate: 20
    },

  ];
*/
}
