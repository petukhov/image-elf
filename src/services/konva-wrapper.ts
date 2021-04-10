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
  private speed: number = 0;
  private imgWidth: number = 1200;

  create(setSettingsCb: Function) {
    this.setSettingsCb = setSettingsCb;

    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight - 54
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.box = new Konva.Rect({
      x: OFFSET,
      y: OFFSET,
      fill: '#00a2FF',
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
      stroke: 'rgb(0, 161, 0)',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(horizontalLine);

    var verticalLine = new Konva.Line({
      points: [OFFSET, OFFSET, OFFSET, window.innerHeight],
      stroke: 'rgb(0, 161, 0)',
      strokeWidth: 1,
      dash: [4, 6],
    });
    this.layer.add(verticalLine);
     
    this.addListeners();
  }

  private addListeners() {
    this.stage.on('click', ({ evt }: any) => {
      // qif (!dragging) return;
      this.boostSize(false);
      let newWidth = evt.layerX - OFFSET;
      if (newWidth > 1200) {
        newWidth = 1200;
      }
      this.setSettingsCb(settings => ({ ...settings, width: newWidth, height: evt.layerY - OFFSET }));
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
      if (newWidth > 1200) {
        this.speed = Math.pow((evt.layerX - OFFSET - 1200), 2) / 150;
        this.boostSize(true);
        newWidth = 1200;
      } else {
        this.boostSize(false);
        this.imgWidth = newWidth;
      }
      this.setSettingsCb(settings => ({ ...settings, width: newWidth, height: evt.layerY - OFFSET }));
    });
  }

  renderRect(width, height) {
    const { box, complexText, layer, imgWidth} = this;
    if (!box) return;
    box.size({
      width,
      height
    });
    complexText.size({
      width,
      height
    });
    complexText.text(`${imgWidth}x${height}`);
    layer.clear();
    layer.draw();
  }

  updateText() {
    const { complexText, layer } = this;
    this.imgWidth += this.speed;
    complexText.text(`${Math.round(this.imgWidth)}`);
    layer.clear();
    layer.draw();
  }

  getDataUrl() {
    const { stage, box, imgWidth } = this;
    const origWidth = box.width();
    const origHeight = box.height();
    console.log('imgWidth', imgWidth);
    this.renderRect(Math.round(imgWidth), origHeight);
    const res = stage.toDataURL({
      x: box.x(),
      y: box.y(),
      width: box.width(),
      height: box.height()
    });
    this.renderRect(origWidth, origHeight);
    return res;
  };

  private onNextFrame = () => {
    // console.log('onNextFrame', imgWidth);
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