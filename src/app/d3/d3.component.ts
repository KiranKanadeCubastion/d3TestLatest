import {AfterViewInit, Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {DemoGroupIvgSection} from "../common/demo-group-ivg-section.model";
import {DemoGroupIvgItem} from "../common/demo-group-ivg-item.model";
import {DemoAdvanced2Service} from "../demo-advanced2.service";

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})

export class D3Component implements OnInit, AfterViewInit, DoCheck {
  @ViewChild('divId') divElement: ElementRef;
  @Input() section: DemoGroupIvgSection;
  @Input() editModeEnabled: boolean = false;

  svg;

  currentType: any = '0';
  svgWidth: number;
  svgHeight: number;
  currentIndex: any = '0';
  globalIndex: any;
  currArrayIndex: any = '0';
  NotlastElement: boolean = true;
  sectionClicked: boolean = false;
  curr_iterator: DemoGroupIvgItem;

  constructor(private entity_service: DemoAdvanced2Service) {

  }

  ngOnInit(): void {
    this.curr_iterator = this.entity_service.getNewSectionItem({
      'type': 'Text',
      'font_name': 'Verdana',
      'font_style': 'light',
      'font_size': '24',
      'font_color': '#FF0000'
    }, this.section.id, '1');
  }

  ngDoCheck() {

    this.svgWidth = this.divElement.nativeElement.offsetWidth;
    this.svgHeight = this.divElement.nativeElement.offsetHeight;
  }

  ngAfterViewInit(): void {

    if (this.section) {

      console.log('section is not null', this.section);
      this.svg = d3.select("#" + this.section.name).append('svg')
      //.attr('id', 'svgBorder')
        .attr('width', "100%")
        .attr('height', "100%");

      this.svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', "100%")
        .attr('width', "100%")
        .attr('fill-opacity', 0)
        /* .style('stroke', 'black')
         .style('stroke-width', 1)*/
        .attr('id', 'border' + this.section.name);


      this.section.items.forEach((value, index, array) => {
        if (value.active)
          this.draggable(value, this);
      });
      this.initIndex();
    } else {
      console.log('section is null');
    }
  }

  initIndex() {
    this.globalIndex = this.section.items.length - 1;
  }


  selected(selectedType, selectedIndex) {

    d3.select('#g' + this.currentType + this.section.name + this.currentIndex)
      .style('stroke-width', '0')
      .style('fill', '#aaaaaa');

    if (selectedIndex !== '-1') {
      //this.Form.enable();
      this.currentType = selectedType;
      this.currentIndex = <any>selectedIndex;
      d3.select('#g' + selectedType + this.section.name + selectedIndex)
        .style('stroke', '#ff4f4f')
        .style('stroke-width', '0.5')
        .style('fill', '#ff4f4f')

      this.sectionClicked = false;
      console.log(this.sectionClicked);


      this.section.items.forEach((value, index, array) => {
        if (value.id == selectedIndex && value.type_cd == selectedType) {
          this.currArrayIndex = index;
          this.curr_iterator = value;
        }
      });
    }
    else {
      this.sectionClicked = true;
      console.log(this.sectionClicked);
    }
  }

  percentageHeightFunc(height) {
    height = Math.max(0, Math.min(height, 100));
    height = height * this.svgHeight / 100;
    return height;
  }

  reverseHeightFunc(height) {
    height = (height / this.svgHeight) * 100;
    return height;
  }

  percentageWidthFunc(width) {
    width = Math.max(0, Math.min(width, 100));
    width = width * this.svgWidth / 100;
    return width;
  }

  reverseWidthFunc(width) {
    width = (width / this.svgWidth) * 100;
    return width;
  }


  ButtonClicked(type) {
    this.NotlastElement = true;
    this.globalIndex = this.globalIndex + 1;
    this.curr_iterator = DemoGroupIvgItem.newItem(type, this.globalIndex);
    this.section.items.push(this.curr_iterator);
    this.draggable(this.curr_iterator, this);
    this.selected(type, this.globalIndex);

  }

  exitFunc() {
    //this.Form.disable();
    if (this.currentIndex > -1) {
      const item = this.section.items[this.currentIndex];
      if (item) {
        item.active = false;
      }
      d3.select('#g' + this.currentType + this.section.name + this.currentIndex).remove();
      //this.section.items.splice(this.currArrayIndex, 1);
      this.currArrayIndex = '0';
      if (this.section.items.length === 0) {
        this.NotlastElement = false;
      }

    }

  }

  /*

   dynamic(d) {
   d3.select('#g' + this.currentType+ this.section.name + this.currentIndex).remove();
   this.draggable(this.curr_iterator, d);
   d3.select('#g' + this.currentType+ this.section.name + this.currentIndex)
   .style('stroke', 'red')
   .style('stroke-width', '.4');
   }
   */


  draggable(iteratorInfo, self) {
    const typeString: string = iteratorInfo.type_cd;
    const indexString: number = iteratorInfo.seq_num;
    const sectionstring: string = this.section.name;
    const dragBarWidth = 1;

    d3.select('#border' + this.section.name).on('click', function () {

      if (self.editModeEnabled == true) {
        self.selected('-1', '-1');
      }
    });

    const newg = this.svg.append('g')
      .attr('id', 'g' + typeString + sectionstring + indexString)
      .data([{
        x: Math.max(0, Math.min(this.percentageWidthFunc(iteratorInfo.x_coordinate), self.svgWidth - this.percentageWidthFunc(iteratorInfo.width))),
        y: Math.max(0, Math.min(this.percentageHeightFunc(iteratorInfo.y_coordinate), self.svgHeight - this.percentageHeightFunc(iteratorInfo.height)))
      }])
      .on('click', function () {
        self.selected(typeString, indexString);
      });

    switch (iteratorInfo.type_cd) {
      case 'Image':
        let dragrect = newg.append('image')                                   // image
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('height', this.percentageHeightFunc(iteratorInfo.height))
          .attr('width', this.percentageWidthFunc(iteratorInfo.width))
          .attr('xlink:href', iteratorInfo.att_name)
          .attr('fill-opacity', .5)
          .attr('cursor', 'move')
          .attr('id', 'dragrect' + typeString + sectionstring + indexString)
          .call(<any>d3.drag()
          //.subject(this.subjectRect)
            .on('drag', dragmove));
        break;
      case  'Video':
        dragrect = newg.append('foreignObject')                             // video
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('id', 'dragrect' + typeString + sectionstring + indexString)
          .attr('height', this.percentageHeightFunc(iteratorInfo.height))
          .attr('width', this.percentageWidthFunc(iteratorInfo.width))
          .attr('cursor', 'move')
          .call(<any>d3.drag()
          //.subject(this.subjectRect)
            .on('drag', dragmove));

        let video = dragrect.append('xhtml:video')
          .attr('height', '100%')
          .attr('width', '100%')
          .attr('controls', '')
          .append('xhtml:source')
          .attr('src', iteratorInfo.att_name)
          .attr('type', 'video/mp4');
        break;
      case  'Text':
      case  'Text-Static':
      case  'Text-Dynamic':
        if (this.editModeEnabled == true) {
          dragrect = newg.append('foreignObject')                             // text
            .attr('x', function (d) {
              return d.x;
            })
            .attr('y', function (d) {
              return d.y;
            })
            .attr('id', 'dragrect' + typeString + sectionstring + indexString)
            .attr('height', this.percentageHeightFunc(iteratorInfo.height))
            .attr('width', this.percentageWidthFunc(iteratorInfo.width))
            .attr('cursor', 'move')
            .style('overflow', 'hidden')
            .style('word-wrap', 'break-word')
            .call(<any>d3.drag()
            //.subject(this.subjectRect)
              .on('drag', dragmove));

          let text = dragrect.append('xhtml:p')
            .style('height', '100%')
            /*
             .append('xhtml:font')
             */
            .style('font-size', iteratorInfo.desc_text_font_size + 'px')
            .text(iteratorInfo.desc_text)
            .style('color', iteratorInfo.desc_text_font_color)
            .style('overflow', 'hidden')
            .style('word-wrap', 'break-word');
          break;
        }
    }

    if (this.editModeEnabled == true) {

      newg.append('rect')
        .attr('x', function (d) {
          return d.x - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d.y + (dragBarWidth / 2);
        })
        .attr('height', this.percentageHeightFunc(iteratorInfo.height) - dragBarWidth)
        .attr('width', dragBarWidth)
        .attr('fill-opacity', .5)
        .attr('id', 'dragbarleft' + typeString + sectionstring + indexString)
        .attr('cursor', 'ew-resize')
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', ldragresize));

      newg.append('rect')
        .attr('x', function (d) {
          return d.x + self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d.y + (dragBarWidth / 2);
        })
        .attr('height', this.percentageHeightFunc(iteratorInfo.height) - dragBarWidth)
        .attr('width', dragBarWidth)
        .attr('fill-opacity', .5)
        .attr('id', 'dragbarright' + typeString + sectionstring + indexString)
        .attr('cursor', 'ew-resize')
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', rdragresize));

      newg.append('rect')
        .attr('x', function (d) {
          return d.x + (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d.y - (dragBarWidth / 2);
        })
        .attr('height', dragBarWidth)
        .attr('width', this.percentageWidthFunc(iteratorInfo.width) - dragBarWidth)
        .attr('fill-opacity', .5)
        .attr('id', 'dragbartop' + typeString + sectionstring + indexString)
        .attr('cursor', 'ns-resize')
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', tdragresize));

      newg.append('rect')
        .attr('x', function (d) {
          return d.x + (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d.y + self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2);
        })
        .attr('height', dragBarWidth)
        .attr('width', this.percentageWidthFunc(iteratorInfo.width) - dragBarWidth)
        .attr('fill-opacity', .5)
        .attr('id', 'dragbarbottom' + typeString + sectionstring + indexString)
        .attr('cursor', 'ns-resize')
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', bdragresize));

      newg.append('circle')
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        })
        .attr('r', 1.5)
        .attr('fill-opacity', 0)
        .attr('cursor', 'nwse-resize')
        .attr('id', 'draglefttopcorner' + typeString + sectionstring + indexString)
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', ltdragresize));

      newg.append('circle')
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y + self.percentageHeightFunc(iteratorInfo.height);
        })
        .attr('r', 1.5)
        .attr('fill-opacity', 0)
        .attr('cursor', 'nesw-resize')
        .attr('id', 'dragleftbottomcorner' + typeString + sectionstring + indexString)
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', lbdragresize));

      newg.append('circle')
        .attr('cx', function (d) {
          return d.x + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d.y;
        })
        .attr('r', 1.5)
        .attr('fill-opacity', 0)
        .attr('cursor', 'nesw-resize')
        .attr('id', 'dragrighttopcorner' + typeString + sectionstring + indexString)
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', rtdragresize));

      newg.append('circle')
        .attr('cx', function (d) {
          return d.x + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d.y + self.percentageHeightFunc(iteratorInfo.height);
        })
        .attr('fill-opacity', 0)
        .attr('id', 'dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('r', 1.5)
        .attr('cursor', 'nwse-resize')
        .style('fill', '#aaaaaa')
        .call(<any>d3.drag()
        // .subject(this.subject)
          .on('drag', rbdragresize));
    }

    function dragmove(d) {


      if (self.editModeEnabled == true) {
        self.selected(typeString, indexString);

        d3.select('#dragrect' + typeString + sectionstring + indexString)
          .attr('x', d.x = Math.max(0, Math.min(self.svgWidth - self.percentageWidthFunc(iteratorInfo.width), d3.event.x)))
          .attr('y', d.y = Math.max(0, Math.min(self.svgHeight - self.percentageHeightFunc(iteratorInfo.height), d3.event.y)));
        iteratorInfo.x_coordinate = self.reverseWidthFunc(d.x);
        iteratorInfo.y_coordinate = self.reverseHeightFunc(d.y);
        d3.select('#dragbarleft' + typeString + sectionstring + indexString)
          .attr('x', function (d) {
            return d['x'] - (dragBarWidth / 2);
          })
          .attr('y', function (d) {
            return d['y'] + (dragBarWidth / 2);
          });
        d3.select('#dragbarright' + typeString + sectionstring + indexString)
          .attr('x', function (d) {
            return d['x'] + self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2);
          })
          .attr('y', function (d) {
            return d['y'] + (dragBarWidth / 2);
          });
        d3.select('#dragbartop' + typeString + sectionstring + indexString)
          .attr('x', function (d) {
            return d['x'] + (dragBarWidth / 2);
          })
          .attr('y', function (d) {
            return d['y'] - (dragBarWidth / 2);
          });
        d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
          .attr('x', function (d) {
            return d['x'] + (dragBarWidth / 2);
          })
          .attr('y', function (d) {
            return d['y'] + self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2);
          });
        d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
          .attr('cx', function (d) {
            return d['x'];
          })
          .attr('cy', function (d) {
            return d['y'];
          });
        d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
          .attr('cx', function (d) {
            return d['x'];
          })
          .attr('cy', function (d) {
            return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
          });
        d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
          .attr('cx', function (d) {
            return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
          })
          .attr('cy', function (d) {
            return d['y'];
          });
        d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
          .attr('cx', function (d) {
            return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
          })
          .attr('cy', function (d) {
            return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
          });
      }
    }


    function ldragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let oldx = d.x;
      d.x = Math.max(0, Math.min(d.x + self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2), d3.event.x));
      iteratorInfo.width = self.reverseWidthFunc(self.percentageWidthFunc(iteratorInfo.width) + (oldx - d.x));
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          return d['x'] - (dragBarWidth / 2);
        });

      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          iteratorInfo.x_coordinate = self.reverseWidthFunc(d['x']);
          return d['x'];
        })
        .attr('width', self.percentageWidthFunc(iteratorInfo.width));

      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);
      d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });
    }

    function rdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + self.percentageWidthFunc(iteratorInfo.width) + d3.event.dx));
      iteratorInfo.width = self.reverseWidthFunc(dragx - d['x']);
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          return dragx - (dragBarWidth / 2);
        });
      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width));
      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);

      d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });
    }

    function tdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2), d3.event['y']));
      iteratorInfo.height = self.reverseHeightFunc(self.percentageHeightFunc(iteratorInfo.height) + (oldy - d['y']));
      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('y', function (d) {
          return d['y'] - (dragBarWidth / 2);
        });

      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('y', function (d) {
          iteratorInfo.y_coordinate = self.reverseHeightFunc(d['y']);
          return d['y'];
        })
        .attr('height', self.percentageHeightFunc(iteratorInfo.height));

      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        })
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        })
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'];
        });
    }

    function bdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + self.percentageHeightFunc(iteratorInfo.height) + d3.event.dy));
      iteratorInfo.height = self.reverseHeightFunc(dragy - d['y']);
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('y', function () {
          return dragy - (dragBarWidth / 2);
        });
      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height));
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);

      d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });

      d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });
    }

    function ltdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let oldx = d['x'];
      d['x'] = Math.max(0, Math.min(d['x'] + self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2), d3.event.x));

      iteratorInfo.width = self.reverseWidthFunc(self.percentageWidthFunc(iteratorInfo.width) + (oldx - d['x']));
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2), d3.event.y));

      iteratorInfo.height = self.reverseHeightFunc(self.percentageHeightFunc(iteratorInfo.height) + (oldy - d['y']));

      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width))
        .attr('height', self.percentageHeightFunc(iteratorInfo.height))
        .attr('x', function (d) {
          iteratorInfo.x_coordinate = self.reverseWidthFunc(d['x']);
          return d['x'];
        })
        .attr('y', function (d) {
          iteratorInfo.y_coordinate = self.reverseHeightFunc(d['y']);
          return d['y'];
        });

      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        })
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        })
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });

      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2))
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        })
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        });
      d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
        .attr('cy', function (d) {
          return d['y'] + 1;
        });

    }


    function rbdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + self.percentageHeightFunc(iteratorInfo.height) + d3.event.dy));
      iteratorInfo.height = self.reverseHeightFunc(dragy - d['y']);
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + self.percentageWidthFunc(iteratorInfo.width) + d3.event.dx));
      iteratorInfo.width = self.reverseWidthFunc(dragx - d['x']);

      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width))
        .attr('height', self.percentageHeightFunc(iteratorInfo.height));
      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);              // - dragBarWidth ??
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('y', function () {
          return dragy - (dragBarWidth / 2);
        })
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('x', function () {
          return dragx - (dragBarWidth / 2);
        })
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });
      d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height);
        });
      d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        });

    }


    function lbdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + self.percentageHeightFunc(iteratorInfo.height) + d3.event.dy));
      iteratorInfo.height = self.reverseHeightFunc(dragy - d['y']);
      let oldx = d['x'];
      d['x'] = Math.max(0, Math.min(d['x'] + self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2), d3.event.x));
      iteratorInfo.width = self.reverseWidthFunc(self.percentageWidthFunc(iteratorInfo.width) + (oldx - d['x']));

      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width))
        .attr('height', self.percentageHeightFunc(iteratorInfo.height))
        .attr('x', function (d) {
          iteratorInfo.x_coordinate = self.reverseWidthFunc(d['x']);
          return d['x'];
        });
      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth) / 2)
        .attr('x', function (d) {
          return d['x'] - (dragBarWidth / 2);
        });
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('y', function (d) {
          return dragy - (dragBarWidth);
        })
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - dragBarWidth);
      d3.select('#dragleftbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        })
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height) - 1;
        });
      d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        });
      d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('cy', function (d) {
          return d['y'] + self.percentageHeightFunc(iteratorInfo.height) - 1;
        });
    }

    function rtdragresize(d) {
      if (self.editModeEnabled == true) {

        self.selected(typeString, indexString);
      }
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth / 2), d3.event.y));
      iteratorInfo.height = self.reverseHeightFunc(self.percentageHeightFunc(iteratorInfo.height) + (oldy - d['y']));
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + self.percentageWidthFunc(iteratorInfo.width) + d3.event.dx));
      iteratorInfo.width = self.reverseWidthFunc(dragx - d['x']);
      d3.select('#dragrect' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width))
        .attr('height', self.percentageHeightFunc(iteratorInfo.height))
        .attr('y', function (d) {
          iteratorInfo.y_coordinate = self.reverseHeightFunc(d['y']);
          return d['y'];
        });
      d3.select('#dragbartop' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - (dragBarWidth) / 2)
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarleft' + typeString + sectionstring + indexString)
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth) / 2)
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarbottom' + typeString + sectionstring + indexString)
        .attr('width', self.percentageWidthFunc(iteratorInfo.width) - dragBarWidth);
      d3.select('#dragbarright' + typeString + sectionstring + indexString)
        .attr('x', function (d) {
          return dragx - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'];
        })
        .attr('height', self.percentageHeightFunc(iteratorInfo.height) - (dragBarWidth) / 2);
      d3.select('#dragrighttopcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        })
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#draglefttopcorner' + typeString + sectionstring + indexString)
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#dragrightbottomcorner' + typeString + sectionstring + indexString)
        .attr('cx', function (d) {
          return d['x'] + self.percentageWidthFunc(iteratorInfo.width);
        });
    }
  }


}
