/**
 * This script is used to create a worker that generates a blob representing an image with a gradient background and text.
 */

const workerFunction = () => {
    self.onmessage = async (event: MessageEvent) => {
        // Extract and validate width and height
        const width = parseInt(event.data.width, 10);
        const height = parseInt(event.data.height, 10);
        const format = event.data.format;
        const imageText = event.data.imageText;

        // Check if width and height are numbers and positive
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            postMessage('Invalid dimensions for the canvas');
            return;
        }

        // Create an OffscreenCanvas
        const offscreen = new OffscreenCanvas(width, height);
        const ctx = offscreen.getContext('2d');

        if (!ctx) {
            postMessage('Failed to get 2D context');
            return;
        }

        // Drawing a rectangle with a linear gradient fill
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2AE5BC');
        gradient.addColorStop(0.5, '#5BD8BD');
        gradient.addColorStop(1, '#99E0D1');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Adding text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.min(width, height) / 10}px Arial`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(imageText, width / 2, height / 2);

        // Convert canvas to blob
        const blob = await offscreen.convertToBlob({ type: `image/${format}` });

        // Send the blob back to the main thread
        postMessage(blob);
    };
};

// Stringify the whole function
const codeToString = workerFunction.toString();
// Extract the main code
const mainCode = codeToString.substring(
    codeToString.indexOf('{') + 1,
    codeToString.lastIndexOf('}'),
);

// Convert the code into a raw data URL
const blob = new Blob([mainCode], { type: 'application/javascript' });
const scriptStr = URL.createObjectURL(blob);

// Export the worker script URL
export default scriptStr;
