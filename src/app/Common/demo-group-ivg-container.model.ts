import {DemoGroupIvgSection} from './demo-group-ivg-section.model';
export class DemoGroupIvgContainer {
  id: string;
  par_id: string;
  seq_num: number;
  type_cd: string;
  bg_color: string;
  alpha: number;
  height: string;
  sections: DemoGroupIvgSection[];
  active: boolean;
}
