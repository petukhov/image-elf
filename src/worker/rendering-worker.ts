/**
 * This Web Worker generates a Blob representing an image with a gradient background and text.
 */

import { Buffer } from 'buffer';
import jpeg from 'jpeg-js';
import imageConfig from '../image-config.json' assert { type: 'json' };

self.onmessage = async (event: MessageEvent) => {
    // Extract and validate width and height
    const width = parseInt(event.data.width, 10);
    const height = parseInt(event.data.height, 10);
    const format = event.data.format;
    const imageText = event.data.imageText;

    // Check if width and height are numbers and positive
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        postMessage('Web Worker got invalid dimensions for the canvas');
        return;
    }

    // Create an OffscreenCanvas since we are in a Web Worker
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');

    if (!ctx) {
        postMessage('Web Worker failed to get 2D context');
        return;
    }

    // Drawing a rectangle with a linear gradient fill
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(imageConfig.gradientStops[0], imageConfig.colors.primary);
    gradient.addColorStop(imageConfig.gradientStops[1], imageConfig.colors.secondary);
    gradient.addColorStop(imageConfig.gradientStops[2], imageConfig.colors.accent);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Adding text
    ctx.fillStyle = imageConfig.textColor;
    ctx.font = `${imageConfig.fontWeight} ${Math.min(width, height) / 10}px ${imageConfig.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(imageText, width / 2, height / 2);

    // Convert canvas to blob, specifying the format and quality.
    // Quality is only applicable for JPEG. The default quality makes the image too large, similar to PNG size, so we reduce it here.
    // P.S I tested different values, and it's the one that was not too jarring, while the size was still pretty small. The main problem with the low quality jpeg images is that the gradients look awful.
    // const blob = await offscreen.convertToBlob({ type: `image/${format}`, quality: 0.9 });

    // var width = 320,
    //     height = 180;
    const frameData = new Buffer(width * height * 4);
    let i = 0;
    while (i < frameData.length) {
        frameData[i++] = 0xff; // red
        frameData[i++] = 0x00; // green
        frameData[i++] = 0x00; // blue
        frameData[i++] = 0xff; // alpha - ignored in JPEGs
    }
    const rawImageData = {
        data: frameData,
        width: width,
        height: height,
    };
    const jpegImageData = jpeg.encode(rawImageData, 50);
    console.log(jpegImageData);

    // Send the blob back to the main thread
    postMessage(jpegImageData);
};
