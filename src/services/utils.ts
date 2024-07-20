
import { ImageFormat } from '../types';
import worker_script from '../worker/worker';

/**
 * The text values shown in the UI and the exported image size are calculated by multiplying the internal values by 10.
 * So if internal representation is 120px, in the UI it will be shown as 1200px, and in the exported image it will also be 1200px.
 */
export const toUIVal = (value: number): number => {
    return value * 10;
};

/**
 * Converting back to internal values. For example when handling the user input for the manual width and height changes.
 */
export const toInternalVal = (value: number): number => {
    return value / 10;
};

/** The text shown in the middle of the export image. */
export const imageText = (width: number, height: number) => {
    return `${width} x ${height}`;
};

export const downloadFile = (fileName: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const element = document.createElement('a');
    element.style.display = 'none';
    element.href = url;
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
};


/** Creates the blob for the image to download using a worker */
export const createImageBlob = async (width: number, height: number, format: ImageFormat): Promise<Blob> => {
    
    // Create a new Worker instance
    const worker = new Worker(worker_script);

    // Create a promise that resolves when the worker sends back the blob
    const blobPromise = new Promise<Blob>((resolve, reject) => {
        worker.onmessage = (event) => {
            resolve(event.data);
        };
        worker.onerror = (error) => {
            reject(error);
        };
    });

    // Send data to the worker
    worker.postMessage({
        width: width,
        height: height,
        format: format,
        imageText: imageText(width, height)
    });

    // Wait for the worker to process and send back the blob
    return blobPromise;
};