import Konva from 'konva';
import { KonvaEventListener } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';

const OFFSET = 30;

export interface CanvasRenderState {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}

export default class KonvaWrapper2 {
    static #stage: Konva.Stage;
    static #layer: Konva.Layer;
    static #box: Konva.Rect;
    static #complexText: Konva.Text;

    static #xAxisTicks: { tickRect: Konva.Rect; tickText: Konva.Text }[] = [];
    static #yAxisTicks: { tickRect: Konva.Rect; tickText: Konva.Text }[] = [];

    static #xAxisLine: Konva.Line;
    static #yAxisLine: Konva.Line;

    static create(containerId: string) {
        this.#stage = new Konva.Stage({
            container: containerId,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.#layer = new Konva.Layer();
        this.#stage.add(this.#layer);

        this.#box = new Konva.Rect({
            x: OFFSET,
            y: OFFSET,
            fill: '#33b4ff',
        });
        this.#layer.add(this.#box);

        this.#complexText = new Konva.Text({
            x: OFFSET,
            y: OFFSET,
            fontSize: 20,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'black',
            padding: 20,
            align: 'center',
            verticalAlign: 'middle',
        });
        this.#layer.add(this.#complexText);

        this.#addXAxisTicks();
        this.#addYAxisTicks();
    }

    static on(
        eventName: string,
        callback: KonvaEventListener<Stage, MouseEvent>,
    ) {
        this.#stage.on(eventName, callback);
    }

    static render({ x, y, width, height, text }: CanvasRenderState) {
        // clear the canvas first
        this.#layer.clear();

        // set up the data
        this.#box.x(x);
        this.#box.y(y);
        this.#box.size({
            width,
            height,
        });
        this.#complexText.x(x);
        this.#complexText.y(y);
        this.#complexText.size({
            width,
            height,
        });
        this.#complexText.text(text);

        // update ticks too
        this.#renderTicks(x, y);

        // draw everything
        this.#layer.draw();
    }

    static destroy() {
        this.#stage.destroy();
    }

    static #addXAxisTicks() {
        for (let i = 0; i < 50; i++) {
            const tickRect = new Konva.Rect({
                x: -100,
                y: -100,
                width: 1,
                height: 10,
                fill: '#000',
            });
            this.#layer.add(tickRect);

            const tickText = new Konva.Text({
                x: -100,
                y: -100,
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fill: '#333',
            });
            this.#layer.add(tickText);

            this.#xAxisTicks.push({
                tickRect,
                tickText,
            });
        }
        this.#xAxisLine = new Konva.Line({
            points: [0, 0, window.innerWidth, 0],
            stroke: 'black',
            strokeWidth: 1,
            dash: [4, 6],
        });
        this.#layer.add(this.#xAxisLine);
    }

    static #addYAxisTicks() {
        for (let i = 0; i < 30; i++) {
            const tickRect = new Konva.Rect({
                x: -100,
                y: -100,
                width: 10,
                height: 1,
                fill: '#000',
            });
            this.#layer.add(tickRect);

            const tickText = new Konva.Text({
                x: -100,
                y: -100,
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fill: '#333',
            });
            this.#layer.add(tickText);

            this.#yAxisTicks.push({
                tickRect,
                tickText,
            });
        }
        this.#yAxisLine = new Konva.Line({
            points: [0, 0, 0, window.innerHeight],
            stroke: 'black',
            strokeWidth: 1,
            dash: [4, 6],
        });
        this.#layer.add(this.#yAxisLine);
    }

    static #renderTicks(x, y) {
        this.#xAxisTicks.forEach(({ tickRect, tickText }, i) => {
            if (i === 0) {
                return;
            }

            tickRect.y(y);
            tickRect.x(x + Math.floor(100 * i));

            tickText.y(y - 15);
            tickText.x(x + Math.floor(100 * i - tickText.width() / 2));
            tickText.text(Math.floor(100 * i).toString());
        });
        this.#xAxisLine.x(x);
        this.#xAxisLine.y(y);

        this.#yAxisTicks.forEach(({ tickRect, tickText }, i) => {
            if (i === 0) {
                return;
            }
            tickRect.x(x);
            tickRect.y(y + Math.floor(100 * i));

            tickText.x(x - tickText.width() - 3);
            tickText.y(y + Math.floor(100 * i) - 5);
            tickText.text(Math.floor(100 * i).toString());
        });

        this.#yAxisLine.x(x);
        this.#yAxisLine.y(y);
    }

    // static moveAxis(evt) {
    //     this.#renderTicks(evt.layerX, evt.layerY);
    // }
}
