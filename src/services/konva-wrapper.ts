import Konva from 'konva';
import { KonvaEventListener } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import imageConfig from '../image-config.json' assert { type: 'json' };
import { toUIVal } from './utils';

export interface CanvasRenderState {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    canvasWidth: number;
    canvasHeight: number;
}

export default class KonvaWrapper {
    // the main container for the canvas
    #stage: Konva.Stage;
    // the layer that contains all the shapes. it's added to the stage
    #layer: Konva.Layer;
    // rectangle that shows the image that can be downloaded
    #box: Konva.Rect;
    // text shown in the middle of the box that shows the dimensions
    #complexText: Konva.Text;

    // x and y axis lines
    #xAxisLine: Konva.Line;
    #yAxisLine: Konva.Line;

    // numbers like 100, 200, 300 added on the x and y axis
    #xAxisTicks: { tickRect: Konva.Rect; tickText: Konva.Text }[] = [];
    #yAxisTicks: { tickRect: Konva.Rect; tickText: Konva.Text }[] = [];

    constructor(containerId: string, canvasWidth: number, canvasHeight: number) {
        this.#stage = new Konva.Stage({
            container: containerId,
            width: canvasWidth,
            height: canvasHeight,
        });

        this.#layer = new Konva.Layer({
            listening: false,
        });
        this.#stage.add(this.#layer);

        this.#box = new Konva.Rect({
            x: 0,
            y: 0,
            fillLinearGradientColorStops: [
                0,
                imageConfig.colors.primary,
                0.5,
                imageConfig.colors.secondary,
                1,
                imageConfig.colors.accent,
            ],
            listening: false,
        });
        this.#layer.add(this.#box);

        this.#complexText = new Konva.Text({
            x: 0,
            y: 0,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle',
            listening: false,
        });
        this.#layer.add(this.#complexText);

        this.#addXAxisTicks();
        this.#addYAxisTicks();
    }

    on(eventName: string, callback: KonvaEventListener<Stage, MouseEvent>) {
        this.#stage.on(eventName, callback);
    }

    render({ x, y, width, height, text, canvasWidth, canvasHeight }: CanvasRenderState) {
        // clear the canvas first
        this.#stage.clear();

        // updates the canvas stage size
        this.#stage.size({ width: canvasWidth, height: canvasHeight });

        if (x < 0 && y < 0) {
            // clearing the stage again asynchronously because sometimes not everything is cleared.
            // this might be a bug in KonvaJs.
            requestAnimationFrame(() => {
                this.#stage.clear();
            });
            return;
        }

        // set up the rectangle and text data
        this.#box.x(x);
        this.#box.y(y);

        this.#box.size({
            width,
            height,
        });

        // update box gradient
        this.#box.fillLinearGradientStartPoint({ x: x, y: y });
        this.#box.fillLinearGradientEndPoint({ x: x + width, y: y + height });

        this.#complexText.x(x);
        this.#complexText.y(y);
        this.#complexText.size({
            width,
            height,
        });
        this.#complexText.text(text);

        // automatically adjust the font size so that it always fits in
        const fontSize = Math.min(width, height) / 10;
        this.#complexText.fontSize(fontSize);

        // set ticks data too
        this.#updateTicks(x, y);

        // update tick points on stage resize
        this.#yAxisLine.points([-1, -1, 0, this.#stage.size().height]);
        this.#xAxisLine.points([-1, -1, this.#stage.size().width, 0]);

        // draw everything
        this.#stage.batchDraw();
    }

    destroy() {
        this.#stage.destroy();
    }

    #addXAxisTicks() {
        for (let i = 0; i < 50; i++) {
            const tickRect = new Konva.Rect({
                x: -100,
                y: -100,
                width: 1,
                height: 10,
                fill: '#000',
                listening: false,
            });
            this.#layer.add(tickRect);

            const tickText = new Konva.Text({
                x: -100,
                y: -100,
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fill: '#333',
                listening: false,
            });
            this.#layer.add(tickText);

            this.#xAxisTicks.push({
                tickRect,
                tickText,
            });
        }
        this.#xAxisLine = new Konva.Line({
            points: [-1, -1, this.#stage.size().width, 0],
            stroke: 'black',
            strokeWidth: 1,
            dash: [4, 6],
            listening: false,
        });
        this.#layer.add(this.#xAxisLine);
    }

    #addYAxisTicks() {
        for (let i = 0; i < 30; i++) {
            const tickRect = new Konva.Rect({
                x: -100,
                y: -100,
                width: 10,
                height: 1,
                fill: '#000',
                listening: false,
            });
            this.#layer.add(tickRect);

            const tickText = new Konva.Text({
                x: -100,
                y: -100,
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fill: '#333',
                listening: false,
            });
            this.#layer.add(tickText);

            this.#yAxisTicks.push({
                tickRect,
                tickText,
            });
        }
        this.#yAxisLine = new Konva.Line({
            points: [-1, -1, 0, this.#stage.size().height],
            stroke: 'black',
            strokeWidth: 1,
            dash: [4, 6],
            listening: false,
        });
        this.#layer.add(this.#yAxisLine);
    }

    #updateTicks(x, y) {
        this.#xAxisTicks.forEach(({ tickRect, tickText }, i) => {
            if (i === 0) {
                return;
            }

            tickRect.y(y);
            tickRect.x(x + Math.floor(100 * i));

            tickText.y(y - 15);
            tickText.x(x + Math.floor(100 * i - tickText.width() / 2));
            tickText.text(toUIVal(Math.floor(100 * i)).toString());
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
            tickText.text(toUIVal(Math.floor(100 * i)).toString());
        });

        this.#yAxisLine.x(x);
        this.#yAxisLine.y(y);
    }
}
