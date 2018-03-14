import {AfterViewInit, Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {Information} from './app.component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Information]
})
export class AppComponent implements OnInit, AfterViewInit, DoCheck {


  @ViewChild('divId') divElement: ElementRef;
  @ViewChild('x') xCord: ElementRef;
  svg;
  currentType: any = '0';
  svgWidth: number;
  svgHeight: number;
  currentIndex: any = '0';
  globalIndex:any;

  constructor(public information: Information) {
  }

  ngOnInit() {
  }

  ngDoCheck() {
    this.svgWidth = this.divElement.nativeElement.offsetWidth;
    this.svgHeight = this.divElement.nativeElement.offsetHeight;

  }

  ngAfterViewInit(): void {


    this.svg = d3.select('#section').append('svg')
      .attr('id', 'svgBorder')
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
      .attr('id','border');


    // console.log(this.xCord.nativeElement.value);
    // this.information.info[this.currentIndex].xCoordinate = this.xCord.nativeElement.value;
    this.information.info.forEach((value, index, array) => {
      console.log('calling draggable ', value);
      this.draggable(value, this);
    });
    this.initIndex();
  }

  initIndex() {
    this.globalIndex = this.information.info.length + 1;
    console.log(this.globalIndex);
  }

  subject(d) {
    let t = d3.select(<any>this);
    return {x: t.attr('x', d['x']), y: t.attr('y', d['y'])};
  }

  subjectRect(d) {
    let t = d3.select(<any>this);
    return {x: t.attr('x'), y: t.attr('y')};
  }

  ButtonClicked(type) {
    this.globalIndex=this.globalIndex+1;
    const curr_iterator = {
      type: type,
      index: this.globalIndex,
      height: 300,
      width: 300,
      xCoordinate: 100,
      yCoordinate: 100
    };
    this.information.info.push(curr_iterator);
    console.log(this.information.info);
    this.draggable(curr_iterator, this);
  }

  exitFunc() {
    d3.select('#g' + this.currentType + this.currentIndex).remove();
  }

  draggable(iteratorInfo, self) {
    const typeString: string = iteratorInfo.type;
    const indexString: number = iteratorInfo.index;

    const dragBarWidth = 2;

    d3.select('#border').on('click', function () {
      selected('-1','-1');
    });

    function selected(selectedType, selectedIndex) {
      d3.select('#g' + self.currentType + self.currentIndex)
        .style('stroke-width', '0');
      console.log('PREVselected'+'#g' + self.currentType + self.currentIndex);
      self.currentType = selectedType;
      self.currentIndex = <any>selectedIndex;
      if(selectedIndex!=='-1'){
        d3.select('#g' + selectedType + selectedIndex)
          .style('stroke', 'red')
          .style('stroke-width', '.4');
        console.log('currently_selected'+'#g' + self.currentType + self.currentIndex);
      }
    }

    const newg = this.svg.append('g')
      .attr('id', 'g' + typeString + indexString)
      .data([{x: iteratorInfo.xCoordinate, y: iteratorInfo.yCoordinate}])
      .on('click', function () {
        console.log('clicked ', typeString, indexString);
        selected(typeString, indexString);
      });

    switch (iteratorInfo.type) {
      case 1:
        let dragrect = newg.append('rect')                                   // rectangle
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('height', iteratorInfo.height)
          .attr('width', iteratorInfo.width)
          .attr('fill-opacity', .5)
          .attr('cursor', 'move')
          .attr('id', 'dragrect' + typeString + indexString)
          .call(<any>d3.drag()
            .subject(this.subjectRect)
            .on('drag', dragmove));
        break;
      case 2:
        dragrect = newg.append('image')                                   // image
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('height', iteratorInfo.height)
          .attr('width', iteratorInfo.width)
          .attr('xlink:href', 'https://static.pexels.com/photos/248797/pexels-photo-248797.jpeg')
          .attr('fill-opacity', .5)
          .attr('cursor', 'move')
          .attr('id', 'dragrect' + typeString + indexString)
          .call(<any>d3.drag()
            .subject(this.subjectRect)
            .on('drag', dragmove));
        break;
      case  3:
        dragrect = newg.append('foreignObject')                             // video
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('id', 'dragrect' + typeString + indexString)
          .attr('height', iteratorInfo.height)
          .attr('width', iteratorInfo.width)
          .attr('cursor', 'move')
          .call(<any>d3.drag()
            .subject(this.subjectRect)
            .on('drag', dragmove));

        let video = dragrect.append('xhtml:video')
          .attr('height', '100%')
          .attr('width', '100%')
          .attr('controls', '')
          .append('xhtml:source')
          .attr('src', 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4')
          .attr('type', 'video/mp4');
        break;
      case  4:
        dragrect = newg.append('foreignObject')                             // text
          .attr('x', function (d) {
            return d.x;
          })
          .attr('y', function (d) {
            return d.y;
          })
          .attr('id', 'dragrect' + typeString + indexString)
          .attr('height', iteratorInfo.height)
          .attr('width', iteratorInfo.width)
          .attr('cursor', 'move')
          .style('overflow', 'hidden')
          .style('word-wrap', 'break-word')
          .call(<any>d3.drag()
            .subject(this.subjectRect)
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
      .attr('height', iteratorInfo.height - dragBarWidth)
      .attr('width', dragBarWidth)
      .attr('fill-opacity', .5)
      .attr('id', 'dragbarleft' + typeString + indexString)
      .attr('cursor', 'ew-resize')
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', ldragresize));

    newg.append('rect')
      .attr('x', function (d) {
        return d.x + iteratorInfo.width - (dragBarWidth / 2);
      })
      .attr('y', function (d) {
        return d.y + (dragBarWidth / 2);
      })
      .attr('height', iteratorInfo.height - dragBarWidth)
      .attr('width', dragBarWidth)
      .attr('fill-opacity', .5)
      .attr('id', 'dragbarright' + typeString + indexString)
      .attr('cursor', 'ew-resize')
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', rdragresize));

    newg.append('rect')
      .attr('x', function (d) {
        return d.x + (dragBarWidth / 2);
      })
      .attr('y', function (d) {
        return d.y - (dragBarWidth / 2);
      })
      .attr('height', dragBarWidth)
      .attr('width', iteratorInfo.width - dragBarWidth)
      .attr('fill-opacity', .5)
      .attr('id', 'dragbartop' + typeString + indexString)
      .attr('cursor', 'ns-resize')
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', tdragresize));

    newg.append('rect')
      .attr('x', function (d) {
        return d.x + (dragBarWidth / 2);
      })
      .attr('y', function (d) {
        return d.y + iteratorInfo.height - (dragBarWidth / 2);
      })
      .attr('height', dragBarWidth)
      .attr('width', iteratorInfo.width - dragBarWidth)
      .attr('fill-opacity', .5)
      .attr('id', 'dragbarbottom' + typeString + indexString)
      .attr('cursor', 'ns-resize')
      .call(<any>d3.drag()
        .subject(this.subject)
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
      .attr('id', 'draglefttopcorner' + typeString + indexString)
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', ltdragresize));

    newg.append('circle')
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y + iteratorInfo.height;
      })
      .attr('r', 1.5)
      .attr('fill-opacity', 0)
      .attr('cursor', 'nesw-resize')
      .attr('id', 'dragleftbottomcorner' + typeString + indexString)
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', lbdragresize));

    newg.append('circle')
      .attr('cx', function (d) {
        return d.x + iteratorInfo.width;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('r', 1.5)
      .attr('fill-opacity', 0)
      .attr('cursor', 'nesw-resize')
      .attr('id', 'dragrighttopcorner' + typeString + indexString)
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', rtdragresize));

    newg.append('circle')
      .attr('cx', function (d) {
        return d.x + iteratorInfo.width;
      })
      .attr('cy', function (d) {
        return d.y + iteratorInfo.height;
      })
      .attr('fill-opacity', 0)
      .attr('id', 'dragrightbottomcorner' + typeString + indexString)
      .attr('r', 1.5)
      .attr('cursor', 'nwse-resize')
      .call(<any>d3.drag()
        .subject(this.subject)
        .on('drag', rbdragresize));

    function dragmove(d) {
      selected(typeString, indexString);
      d3.select('#dragrect' + typeString + indexString)
        .attr('x', d.x = Math.max(0, Math.min(self.svgWidth - iteratorInfo.width, d3.event.x)))
        .attr('y', d.y = Math.max(0, Math.min(self.svgHeight - iteratorInfo.height, d3.event.y)));
      iteratorInfo.xCoordinate = d.x;
      iteratorInfo.yCoordinate = d.y;
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        });
      d3.select('#dragbarright' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] + iteratorInfo.width - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        });
      d3.select('#dragbartop' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'] - (dragBarWidth / 2);
        });
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'] + iteratorInfo.height - (dragBarWidth / 2);
        });
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
    }


    function ldragresize(d) {
      selected(typeString, indexString);
      let oldx = d.x;
      d.x = Math.max(0, Math.min(d.x + iteratorInfo.width - (dragBarWidth / 2), d3.event.x));
      iteratorInfo.width = iteratorInfo.width + (oldx - d.x);
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] - (dragBarWidth / 2);
        });

      d3.select('#dragrect' + typeString + indexString)
        .attr('x', function (d) {
          iteratorInfo.xCoordinate = d['x'];
          return d['x'];
        })
        .attr('width', iteratorInfo.width);

      d3.select('#dragbartop' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('width', iteratorInfo.width - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('x', function (d) {
          return d['x'] + (dragBarWidth / 2);
        })
        .attr('width', iteratorInfo.width - dragBarWidth);
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
    }

    function rdragresize(d) {
      selected(typeString, indexString);
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + iteratorInfo.width + d3.event.dx));
      iteratorInfo.width = dragx - d['x'];
      d3.select('#dragbarright' + typeString + indexString)
        .attr('x', function (d) {
          return dragx - (dragBarWidth / 2);
        });
      d3.select('#dragrect' + typeString + indexString)
        .attr('width', iteratorInfo.width);
      d3.select('#dragbartop' + typeString + indexString)
        .attr('width', iteratorInfo.width - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('width', iteratorInfo.width - dragBarWidth);

      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
    }

    function tdragresize(d) {
      selected(typeString, indexString);
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + iteratorInfo.height - (dragBarWidth / 2), d3.event['y']));
      iteratorInfo.height = iteratorInfo.height + (oldy - d['y']);
      d3.select('#dragbartop' + typeString + indexString)
        .attr('y', function (d) {
          return d['y'] - (dragBarWidth / 2);
        });

      d3.select('#dragrect' + typeString + indexString)
        .attr('y', function (d) {
          iteratorInfo.yCoordinate = d['y'];
          return d['y'];
        })
        .attr('height', iteratorInfo.height);

      d3.select('#dragbarleft' + typeString + indexString)
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        })
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#dragbarright' + typeString + indexString)
        .attr('y', function (d) {
          return d['y'] + (dragBarWidth / 2);
        })
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'];
        });
      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'];
        });
    }

    function bdragresize(d) {
      selected(typeString, indexString);
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + iteratorInfo.height + d3.event.dy));
      iteratorInfo.height = dragy - d['y'];
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('y', function () {
          return dragy - (dragBarWidth / 2);
        });
      d3.select('#dragrect' + typeString + indexString)
        .attr('height', iteratorInfo.height);
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#dragbarright' + typeString + indexString)
        .attr('height', iteratorInfo.height - dragBarWidth);

      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'];
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });

      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
    }

    function ltdragresize(d) {
      selected(typeString, indexString);
      let oldx = d['x'];
      d['x'] = Math.max(0, Math.min(d['x'] + iteratorInfo.width - (dragBarWidth / 2), d3.event.x));

      iteratorInfo.width = iteratorInfo.width + (oldx - d['x']);
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + iteratorInfo.height - (dragBarWidth / 2), d3.event.y));

      iteratorInfo.height = iteratorInfo.height + (oldy - d['y']);

      d3.select('#dragrect' + typeString + indexString)
        .attr('width', iteratorInfo.width)
        .attr('height', iteratorInfo.height)
        .attr('x', function (d) {
          iteratorInfo.xCoordinate = d['x'];
          return d['x'];
        })
        .attr('y', function (d) {
          iteratorInfo.yCoordinate = d['y'];
          return d['y'];
        });

      d3.select('#dragbartop' + typeString + indexString)
        .attr('width', iteratorInfo.width - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        })
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('height', iteratorInfo.height - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        })
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('width', iteratorInfo.width - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });

      d3.select('#dragbarright' + typeString + indexString)
        .attr('height', iteratorInfo.height - (dragBarWidth / 2))
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        })
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        });
      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cy', function (d) {
          return d['y'] + 1;
        });

    }


    function rbdragresize(d) {
      selected(typeString, indexString);
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + iteratorInfo.height + d3.event.dy));
      iteratorInfo.height = dragy - d['y'];
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + iteratorInfo.width + d3.event.dx));
      iteratorInfo.width = dragx - d['x'];

      d3.select('#dragrect' + typeString + indexString)
        .attr('width', iteratorInfo.width)
        .attr('height', iteratorInfo.height);
      d3.select('#dragbartop' + typeString + indexString)
        .attr('width', iteratorInfo.width - dragBarWidth);              // - dragBarWidth ??
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('y', function () {
          return dragy - (dragBarWidth / 2);
        })
        .attr('width', iteratorInfo.width - dragBarWidth);
      d3.select('#dragbarright' + typeString + indexString)
        .attr('x', function () {
          return dragx - (dragBarWidth / 2);
        })
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height;
        });
      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        });

    }


    function lbdragresize(d) {
      selected(typeString, indexString);
      let dragy = Math.max(d['y'] + (dragBarWidth / 2), Math.min(self.svgHeight, d['y'] + iteratorInfo.height + d3.event.dy));
      iteratorInfo.height = dragy - d['y'];
      let oldx = d['x'];
      d['x'] = Math.max(0, Math.min(d['x'] + iteratorInfo.width - (dragBarWidth / 2), d3.event.x));
      iteratorInfo.width = iteratorInfo.width + (oldx - d['x']);

      d3.select('#dragrect' + typeString + indexString)
        .attr('width', iteratorInfo.width)
        .attr('height', iteratorInfo.height)
        .attr('x', function (d) {
          iteratorInfo.xCoordinate = d['x'];
          return d['x'];
        });
      d3.select('#dragbartop' + typeString + indexString)
        .attr('width', iteratorInfo.width - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('height', iteratorInfo.height - (dragBarWidth) / 2)
        .attr('x', function (d) {
          return d['x'] - (dragBarWidth / 2);
        });
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('y', function (d) {
          return dragy - (dragBarWidth);
        })
        .attr('width', iteratorInfo.width - (dragBarWidth / 2))
        .attr('x', function (d) {
          return d['x'];
        });
      d3.select('#dragbarright' + typeString + indexString)
        .attr('height', iteratorInfo.height - dragBarWidth);
      d3.select('#dragleftbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        })
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height - 1;
        });
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + 1;
        });
      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cy', function (d) {
          return d['y'] + iteratorInfo.height - 1;
        });
    }

    function rtdragresize(d) {
      selected(typeString, indexString);
      let oldy = d['y'];
      d['y'] = Math.max(0, Math.min(d['y'] + iteratorInfo.height - (dragBarWidth / 2), d3.event.y));
      iteratorInfo.height = iteratorInfo.height + (oldy - d['y']);
      let dragx = Math.max(d['x'] + (dragBarWidth / 2), Math.min(self.svgWidth, d['x'] + iteratorInfo.width + d3.event.dx));
      iteratorInfo.width = dragx - d['x'];
      d3.select('#dragrect' + typeString + indexString)
        .attr('width', iteratorInfo.width)
        .attr('height', iteratorInfo.height)
        .attr('y', function (d) {
          iteratorInfo.yCoordinate = d['y'];
          return d['y'];
        });
      d3.select('#dragbartop' + typeString + indexString)
        .attr('width', iteratorInfo.width - (dragBarWidth) / 2)
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarleft' + typeString + indexString)
        .attr('height', iteratorInfo.height - (dragBarWidth) / 2)
        .attr('y', function (d) {
          return d['y'];
        });
      d3.select('#dragbarbottom' + typeString + indexString)
        .attr('width', iteratorInfo.width - dragBarWidth);
      d3.select('#dragbarright' + typeString + indexString)
        .attr('x', function (d) {
          return dragx - (dragBarWidth / 2);
        })
        .attr('y', function (d) {
          return d['y'];
        })
        .attr('height', iteratorInfo.height - (dragBarWidth) / 2);
      d3.select('#dragrighttopcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        })
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#draglefttopcorner' + typeString + indexString)
        .attr('cy', function (d) {
          return d['y'] + 1;
        });
      d3.select('#dragrightbottomcorner' + typeString + indexString)
        .attr('cx', function (d) {
          return d['x'] + iteratorInfo.width;
        });
    }
  }
}
