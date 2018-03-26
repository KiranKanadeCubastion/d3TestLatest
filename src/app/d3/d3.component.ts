import {AfterViewInit, Component, DoCheck, ElementRef, Input, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {DemoGroupIvgSection} from "../Common/demo-group-ivg-section.model";
import {DemoGroupIvgItem} from "../Common/demo-group-ivg-item.model";

@Component({
  selector: 'app-d3',
  templateUrl: './d3.component.html',
  styleUrls: ['./d3.component.css']
})


export class D3Component implements AfterViewInit, DoCheck {

  @ViewChild('divId') divElement: ElementRef;

  @Input() section: DemoGroupIvgSection;

  svg;
  currentType: any = '0';
  svgWidth: number;
  svgHeight: number;
  currentIndex: any = '0';
  globalIndex: any;
  currArrayIndex: any = '0';
  NotlastElement: boolean = true;

  curr_iterator: DemoGroupIvgItem = DemoGroupIvgItem.newItem('Image', 0);

  constructor() {
  }

  ngDoCheck() {

    this.svgWidth = this.divElement.nativeElement.offsetWidth - 2;
    this.svgHeight = this.divElement.nativeElement.offsetHeight - 2;
  }

  ngAfterViewInit(): void {

    if (this.section) {
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
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .attr('id', 'border' + this.section.name);


      this.section.items.forEach((value, index, array) => {
        this.draggable(value, this);
      });
      this.initIndex();
    } else {
    }
  }

  initIndex() {
    this.globalIndex = this.section.items.length - 1;
  }

  selected(selectedType, selectedIndex) {
    d3.select('#g' + this.currentType + this.section.name + this.currentIndex)
      .style('stroke-width', '0');

    if (selectedIndex !== '-1') {
      //this.Form.enable();
      this.currentType = selectedType;
      this.currentIndex = <any>selectedIndex;
      d3.select('#g' + selectedType + this.section.name + selectedIndex)
        .style('stroke', 'red')
        .style('stroke-width', '.4');


      this.section.items.forEach((value, index, array) => {
        if (value.id == selectedIndex && value.type_cd == selectedType) {
          this.currArrayIndex = index;
          this.curr_iterator = value;
        }
      });
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
    d3.select('#g' + this.currentType + this.section.name + this.currentIndex).remove();
    this.section.items.splice(this.currArrayIndex, 1);
    this.currArrayIndex = '0';
    if (this.section.items.length === 0) {
      this.NotlastElement = false;
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
    const indexString: number = iteratorInfo.index;
    const sectionstring: string = this.section.name;
    const dragBarWidth = 2;

    d3.select('#border' + this.section.name).on('click', function () {
      self.selected('-1', '-1');
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
          .attr('xlink:href', 'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg')
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
          .attr('src', 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4')
          .attr('type', 'video/mp4');
        break;
      case  'Text':
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
          .append('xhtml:font')
          .attr('size', '5')
          .text('This is sample text');
        break;

    }

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
      .call(<any>d3.drag()
      // .subject(this.subject)
        .on('drag', rbdragresize));

    function dragmove(d) {
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


    function ldragresize(d) {
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
      self.selected(typeString, indexString);
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
