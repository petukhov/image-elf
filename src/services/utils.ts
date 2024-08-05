import { isMobile } from 'react-device-detect';
import { ImageFormat } from '../types';
import RenderingWorker from '../worker/rendering-worker?worker';

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

async function saveFileNewApi(fileName: string, blob: Blob) {
    // create a new handle with the suggested file name
    console.warn('saveFileNewApi 1');
    const newHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
            {
                description: 'All Files',
                accept: {
                    'application/octet-stream': ['.jpeg'],
                },
            },
        ],
    });

    console.warn('saveFileNewApi 2');
    // create a FileSystemWritableFileStream to write to
    const writableStream = await newHandle.createWritable();

    // Ensure the blob is written completely
    const reader = blob.stream().getReader();
    const writer = writableStream.getWriter();
    // const chunkSize = 64 * 1024; // 64KB chunks

    let totalBytesWritten = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        await writer.write(value);
        totalBytesWritten += value.length;
    }

    console.warn('saveFileNewApi 3 totalBytesWritten ', totalBytesWritten);
    // write our file
    // await writableStream.write(blob);
    // await writer.close();

    // console.warn('saveFileNewApi 4');
    // close the file and write the contents to disk.
    // await writableStream.close();

    // console.warn('saveFileNewApi 5');
}

const saveFileClassicApi = (fileName: string, blob: Blob) => {
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
const createImageBlob = async (
    width: number,
    height: number,
    format: ImageFormat,
): Promise<Blob> => {
    // Create a Web Worker instance to render the image into a blob.
    const worker = new RenderingWorker();

    // Create a promise that resolves when the worker sends back the blob
    const blobPromise = new Promise<Blob>((resolve, reject) => {
        worker.onmessage = event => {
            if (event.data instanceof Blob) {
                resolve(event.data);
            } else {
                reject(event.data);
            }
        };
        worker.onerror = error => {
            reject(error);
        };
    });

    // Send data to the worker
    worker.postMessage({
        width: width,
        height: height,
        format: format,
        imageText: imageText(width, height),
    });

    // Wait for the worker to process and send back the blob
    return blobPromise;
};

/** Generates an image and then saves it in a specified format on the user's computer. */
export const saveAsImage = (
    width: number,
    height: number,
    format: ImageFormat,
    onComplete: () => void,
) => {
    const loggingData = {
        width,
        height,
        format,
        isMobile,
    };
    window.gtag('event', 'save_img_start', loggingData);
    createImageBlob(width, height, format)
        .then(blob => {
            console.log('created blob with size ', blob.size);
            // get size of blob
            saveFileNewApi('img.' + format, blob);
            window.gtag('event', 'save_img_success', loggingData);
        })
        .catch(error => {
            console.error('Error generating image:', error);
            window.gtag('event', 'save_img_error', {
                ...loggingData,
                error,
            });
        })
        .finally(onComplete);
};
