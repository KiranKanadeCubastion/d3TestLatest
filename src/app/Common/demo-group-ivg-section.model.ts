import {DemoGroupIvgItem} from './demo-group-ivg-item.model';
export class DemoGroupIvgSection {
  display_name: string;
  type_cd: string;
  desc_text_line_1: string;
  seq_num: number;
  alpha: number;
  container_id: string;

  constructor(public id: string, public name: string,
              public width: string, public height: string,
              public bg_color: string, public active: boolean,
              public items: DemoGroupIvgItem[]) {

  }
}
