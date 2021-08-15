import Konva from 'konva';
import NiceLabels from './nice-labels';

const OFFSET = 30;
export default class KonvaWrapper {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private box: Konva.Rect;
  private complexText: Konva.Text;

  private setSettingsCb: Function;
  
  private boostingSize: boolean = false;
  private animationReqId: number;
  private speedX: number = 0;
  private speedY: number = 0;

  private xAxisTicks: { tickRect: Konva.Rect, tickText: Konva.Text }[] = [];
  private yAxisTicks: { tickRect: Konva.Rect, tickText: Konva.Text }[] = [];

  private xAxisLine: Konva.Line;
  private yAxisLine: Konva.Line;

  private x = 0;
  private y = 0;

  private cover;


  create(setSettingsCb: Function) {
    this.setSettingsCb = setSettingsCb;

    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // const rightArea = new Konva.Rect({
    //   x: 1200 + OFFSET,
    //   y: OFFSET,
    //   width: 300,
    //   height: 800,
    //   fill: '#d9f1ff',
    // });
    // this.layer.add(rightArea);

    // const bottomArea = new Konva.Rect({
    //   x: OFFSET,
    //   y: 500 + OFFSET,
    //   width: 1500,
    //   height: 300,
    //   fill: '#d9f1ff',
    // });
    // this.layer.add(bottomArea);

    this.box = new Konva.Rect({
      x: OFFSET,
      y: OFFSET,
      fill: '#33b4ff',
    });
    this.layer.add(this.box);

    this.complexText = new Konva.Text({
      x: OFFSET,
      y: OFFSET,
      fontSize: 20,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: 'black',
      padding: 20,
      align: 'center',
      verticalAlign: 'middle'
    });
    this.layer.add(this.complexText);

    // var horizontalLine = new Konva.Line({
    //   points: [OFFSET, OFFSET, window.innerWidth, OFFSET],
    //   stroke: 'black',
    //   strokeWidth: 1,
    //   dash: [4, 6],
    // });
    // this.layer.add(horizontalLine);

    // var verticalLine = new Konva.Line({
    //   points: [OFFSET, OFFSET, OFFSET, window.innerHeight],
    //   stroke: 'black',
    //   strokeWidth: 1,
    //   dash: [4, 6],
    // });
    // this.layer.add(verticalLine);

    this.addXAxisTicks();
    this.addYAxisTicks();

    this.resetXAxisTicks();
    this.resetYAxisTicks();
     
    this.addListeners();
  }

  private addListeners() {
    this.cover = document.querySelector('#cover');
    this.cover.addEventListener('click', () => {
      console.log('doc click');
      // cover.setAttribute('display', 'none');
      if (![...this.cover.classList].includes('hide')) {
        this.cover.classList.add('hide');
        this.renderTicks2(-10, -10);
        this.setSettingsCb(settings => {
          return { 
            ...settings, 
            width: 0,
            height: 0, 
            imgWidth: 0,
            imgHeight: 0,
            menuVisible: false
          };
        });
      }
      // this.setSettingsCb(settings => {
      //   return { 
      //     ...settings, 
      //     menuVisible: false
      //   };
      // });
      // this.setSettingsCb(settings => {
      //     dragging = false;
      //     return { 
      //       ...settings, 
      //       menuVisible: false
      //     };
      //   }
      // );
    }, { capture: true });
    this.stage.on('click', ({ evt }: any) => {
      // this.boostSize(false);
      // let newWidth = evt.layerX - OFFSET;
      // if (newWidth > 1200) {
      //   newWidth = 1200;
      // }
      // this.imgWidth = newWidth;
      console.log('click');
      // this.setSettingsCb(settings => ({ 
      //   ...settings, 
      //   width: newWidth, 
      //   height: evt.layerY - OFFSET, 
      //   imgWidth: newWidth,
      // }));
      // downloadWrapper.current();
      // this.setSettingsCb(settings => {
      //   if (settings.menuVisible) {
      //     dragging = false;
      //     return { 
      //       ...settings, 
      //       menuVisible: false
      //     };
      //   }
      // });
    });

    let dragging = false;

    this.stage.on('mousedown', ({ evt }: any) => {
      dragging = true;
      this.x = evt.layerX;
      this.y = evt.layerY;
      console.log('mousedown');
      this.setSettingsCb(settings => {
          return { 
            ...settings, 
            menuVisible: false
          };
      });
    });
    this.stage.on('mouseup', ({ evt }) => {
      dragging = false;
      // this.boostSize(false);
      console.log('mouseup');
      if (evt.layerX > this.x && evt.layerY > this.y) {
        this.cover.classList.remove('hide');
        this.setSettingsCb(settings => {
          return { 
            ...settings, 
            menuVisible: true
          };
        });
      }
    });
    this.stage.on('mousemove', ({ evt }: any) => {

      // if (!dragging) {
      //   this.moveAxis(evt);
      //   this.render();
      //   return;
      // }
      // let newWidth = evt.layerX - this.x;
      // let newHeight = evt.layerY - this.y;
      
      // if (newWidth > 1200) {
      //   this.speedX = Math.pow((evt.layerX - OFFSET - 1200), 2) / 150;
      //   newWidth = 1200;
      // } else {
      //   this.speedX = 0;
      //   this.resetXAxisTicks();
      // }

      // if (newHeight > 500) {
      //   this.speedY = Math.pow((evt.layerY - OFFSET - 500), 2) / 150;
      //   newHeight = 500;
      // } else {
      //   this.speedY = 0;
      //   this.resetYAxisTicks();
      // }
      evt.stopPropagation();

      this.setSettingsCb(settings => {
        if (!dragging) {
          if (!settings.menuVisible) {
            this.moveAxis(evt);
          }
          this.render();
          return settings;
        }
        let newWidth = evt.layerX - this.x;
        let newHeight = evt.layerY - this.y;
        
        if (newWidth < 0 || newHeight < 0) {
          return settings;
        }

        return { 
          ...settings, 
          width: newWidth, 
          height: newHeight,
          imgWidth: newWidth * 10,
          imgHeight: newHeight * 10,
          x: this.x,
          y: this.y
        };
      });
      // console.warn('1');
      // this.boostSize(newWidth >= 1200 || newHeight >= 500);
    });
  }

  renderRect(width, height, imgWidth, imgHeight, x, y) {
    const { box, complexText } = this;
    if (!box) return;
    box.x(x);
    box.y(y);
    box.size({
      width,
      height
    });
    complexText.x(x);
    complexText.y(y);
    complexText.size({
      width,
      height
    });
    complexText.text(`${imgWidth}x${imgHeight}`);
    this.render();
  }

  render() {
    const {  layer } = this;
    layer.clear();
    layer.draw();
    // console.warn('render');
  }

  addXAxisTicks() {
    for (let i = 0; i < 50; i++) {
      const tickRect = new Konva.Rect({
        x: -100,
        y: -100,
        width: 1,
        height: 10,
        fill: '#000',
      });
      this.layer.add(tickRect);

      const tickText = new Konva.Text({
        x: -100,
        y: -100,
        fontSize: 12,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fill: '#333',
      });
      this.layer.add(tickText);

      this.xAxisTicks.push({
        tickRect,
        tickText
      });
    }
    this.xAxisLine = new Konva.Line({
      points: [0, 0, window.innerWidth, 0],
      stroke: 'black',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(this.xAxisLine);
  }

  addYAxisTicks() {
    for (let i = 0; i < 30; i++) {
      const tickRect = new Konva.Rect({
        x: -100,
        y: -100,
        width: 10,
        height: 1,
        fill: '#000',
      });
      this.layer.add(tickRect);

      const tickText = new Konva.Text({
        x: -100,
        y: -100,
        fontSize: 12,
        fontFamily: 'Arial',
        fontStyle: 'normal',
        fill: '#333',
      });
      this.layer.add(tickText);

      this.yAxisTicks.push({
        tickRect,
        tickText
      });
    }
    this.yAxisLine = new Konva.Line({
      points: [0, 0, 0, window.innerHeight],
      stroke: 'black',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(this.yAxisLine);
  }

  renderTicks(xScale?, yScale?) {
    if (xScale) {
      this.xAxisTicks.forEach(({ tickRect, tickText }, i) => {
        tickRect.x(OFFSET + Math.floor(xScale.normalizedTickSpacing * i));
        tickText.x(OFFSET + Math.floor(xScale.normalizedTickSpacing * i - tickText.width() / 2));
        tickText.text(Math.floor(xScale.tickSpacing * i).toString());
      });
    }

    if (yScale) {
      this.yAxisTicks.forEach(({ tickRect, tickText }, i) => {
        if (i === 0) { return; }
        tickRect.y(OFFSET + Math.floor(yScale.normalizedTickSpacing * i));
        tickText.y(OFFSET + Math.floor(yScale.normalizedTickSpacing * i) - 5);
        tickText.text(Math.floor(yScale.tickSpacing * i).toString());
      });
    }
  }

  renderTicks2(x, y) {
    this.xAxisTicks.forEach(({ tickRect, tickText }, i) => {
      if (i === 0) { return; }

      tickRect.y(y);
      tickRect.x(x + Math.floor(100 * i));

      tickText.y(y - 15);
      tickText.x(x + Math.floor(100 * i - tickText.width() / 2));
      tickText.text(Math.floor(100 * i).toString());
    });
    this.xAxisLine.x(x);
    this.xAxisLine.y(y);

    this.yAxisTicks.forEach(({ tickRect, tickText }, i) => {
      if (i === 0) { return; }
      tickRect.x(x);
      tickRect.y(y + Math.floor(100 * i));

      tickText.x(x - tickText.width() - 3);
      tickText.y(y + Math.floor(100 * i) - 5);
      tickText.text(Math.floor(100 * i).toString());
    });

    this.yAxisLine.x(x);
    this.yAxisLine.y(y);
  }

  resetXAxisTicks() {
    const niceLabels = new NiceLabels();
    // this.renderTicks(niceLabels.niceScale(0, 1200, 15, 1200));
  }

  resetYAxisTicks() {
    const niceLabels = new NiceLabels();
    // this.renderTicks(null, niceLabels.niceScale(0, 500, 7, 500));
  }

  moveAxis(evt) {
    this.renderTicks2(evt.layerX, evt.layerY);
  }

  updateText() {
    this.setSettingsCb(settings => {
      const imgWidth = Math.min(Math.round(settings.imgWidth + this.speedX), 9999);
      const imgHeight = Math.min(Math.round(settings.imgHeight + this.speedY), 9999);
      
      const nl = new NiceLabels();
      const xScale = imgWidth >= 1200 ? nl.niceScale(0, imgWidth, 15, settings.width) : null;
      const yScale = imgHeight >= 500 ? nl.niceScale(0, imgHeight, 7, settings.height) : null;
      
      // this.renderTicks(xScale, yScale);
      // console.log('scale', scale);
      return { 
        ...settings,
        imgWidth,
        imgHeight
      };
    });
  }

  getDataUrl(imgWidth, imgHeight) {
    const { stage, box } = this;
    const origWidth = box.width();
    const origHeight = box.height();
    this.layer.clear();

    const originalX = box.x();
    const originalY = box.y();

    this.renderRect(Math.round(imgWidth), imgHeight, imgWidth, imgHeight, originalX, originalY);
    const res = stage.toDataURL({
      x: originalX,
      y: originalY,
      width: box.width(),
      height: box.height()
    });
    this.renderRect(origWidth, origHeight, imgWidth, imgHeight, originalX, originalY);
    return res;
  };

  private onNextFrame = () => {
    this.updateText();
    if (this.boostingSize) {
      window.requestAnimationFrame(this.onNextFrame);
    }
  }
  
  private boostSize(turnOn) {
    // console.log('boost', this.boostingSize, turnOn);
    if (!this.boostingSize && turnOn) {
      console.warn('start boosting');
      this.animationReqId = window.requestAnimationFrame(this.onNextFrame);
      this.boostingSize = true;
    } else if (this.boostingSize && !turnOn) {
      console.warn('stop boosting');
      window.cancelAnimationFrame(this.animationReqId);
      this.boostingSize = false;
    }
  }
}