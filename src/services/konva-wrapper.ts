import Konva from 'konva';

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

  create(setSettingsCb: Function) {
    this.setSettingsCb = setSettingsCb;

    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight - 54
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    const rightArea = new Konva.Rect({
      x: 1200 + OFFSET,
      y: OFFSET,
      width: 300,
      height: 800,
      fill: '#d9f1ff',
    });
    this.layer.add(rightArea);

    const bottomArea = new Konva.Rect({
      x: OFFSET,
      y: 500 + OFFSET,
      width: 1500,
      height: 300,
      fill: '#d9f1ff',
    });
    this.layer.add(bottomArea);

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

    var horizontalLine = new Konva.Line({
      points: [OFFSET, OFFSET, window.innerWidth, OFFSET],
      stroke: 'black',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(horizontalLine);

    var verticalLine = new Konva.Line({
      points: [OFFSET, OFFSET, OFFSET, window.innerHeight],
      stroke: 'black',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(verticalLine);
     
    this.addListeners();
  }

  private addListeners() {
    this.stage.on('click', ({ evt }: any) => {
      this.boostSize(false);
      let newWidth = evt.layerX - OFFSET;
      if (newWidth > 1200) {
        newWidth = 1200;
      }
      // this.imgWidth = newWidth;
      console.warn('click');
      // this.setSettingsCb(settings => ({ 
      //   ...settings, 
      //   width: newWidth, 
      //   height: evt.layerY - OFFSET, 
      //   imgWidth: newWidth,
      // }));
      // downloadWrapper.current();
    });

    let dragging = false;
    this.stage.on('mousedown', () => {
      dragging = true;
    });
    this.stage.on('mouseup mouseleave', () => {
      dragging = false;
      this.boostSize(false);
    });
    this.stage.on('mousemove', ({ evt }: any) => {
      if (!dragging) return;
      let newWidth = evt.layerX - OFFSET;
      let newHeight = evt.layerY - OFFSET;
      
      if (newWidth > 1200) {
        this.speedX = Math.pow((evt.layerX - OFFSET - 1200), 2) / 150;
        newWidth = 1200;
      } else {
        this.speedX = 0;
      }

      if (newHeight > 500) {
        this.speedY = Math.pow((evt.layerY - OFFSET - 500), 2) / 150;
        newHeight = 500;
      } else {
        this.speedY = 0;
      }

      this.setSettingsCb(settings => {
        return { 
          ...settings, 
          width: newWidth, 
          height: newHeight,
          imgWidth: newWidth >= 1200 ? settings.imgWidth : newWidth,
          imgHeight: newHeight >= 500 ? settings.imgHeight : newHeight
        };
      });

      this.boostSize(newWidth >= 1200 || newHeight >= 500);
    });
  }

  renderRect(width, height, imgWidth, imgHeight) {
    const { box, complexText, layer } = this;
    if (!box) return;
    box.size({
      width,
      height
    });
    complexText.size({
      width,
      height
    });
    complexText.text(`${imgWidth}x${imgHeight}`);
    layer.clear();
    layer.draw();
  }

  updateText() {
    this.setSettingsCb(settings => ({ 
      ...settings,
      imgWidth: Math.min(Math.round(settings.imgWidth + this.speedX), 9999),
      imgHeight: Math.min(Math.round(settings.imgHeight + this.speedY), 9999)
    }));
  }

  getDataUrl(imgWidth, imgHeight) {
    const { stage, box } = this;
    const origWidth = box.width();
    const origHeight = box.height();
    this.renderRect(Math.round(imgWidth), imgHeight, imgWidth, imgHeight);
    const res = stage.toDataURL({
      x: box.x(),
      y: box.y(),
      width: box.width(),
      height: box.height()
    });
    this.renderRect(origWidth, origHeight, imgWidth, imgHeight);
    return res;
  };

  private onNextFrame = () => {
    this.updateText();
    if (this.boostingSize) {
      window.requestAnimationFrame(this.onNextFrame);
    }
  }
  
  private boostSize(turnOn) {
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