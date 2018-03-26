export class DemoGroupIvgItem {
  id: string;
  name: string;
  type_cd: string;
  width: number;
  height: number;
  alpha: number;
  x_coordinate: number;
  y_coordinate: number;
  section_id: string;
  att_id: string;
  att_name: string;
  thumbnail_att_id: string;
  thumbnail_att_name: string;
  desc_text: string;
  desc_text_font_name: string;
  desc_text_font_style: string;
  desc_text_font_size: number;
  desc_text_font_color: string;
  index: number;
  active: boolean;
  moveEnabled: boolean;

  public static newItem(type: string, index: number): DemoGroupIvgItem {
    return {
      'id': 'new_record',
      'name': 'section',
      'type_cd': type,
      'width': 30, // percentage
      'height': 30, // percentage
      'alpha': 1,
      'x_coordinate': 10,
      'y_coordinate': 10,
      'section_id': '0',
      'index': index,
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
    };
  }
}
