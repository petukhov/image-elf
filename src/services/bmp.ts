export async function generateAndSaveLargeBMP() {
    try {
        // Prompt the user to select a file location and create a file handle
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'largeImage.bmp',
            types: [
                {
                    description: 'Bitmap Image',
                    accept: {
                        'image/bmp': ['.bmp'],
                    },
                },
            ],
        });

        // Create a writable stream to the file
        const writableStream = await fileHandle.createWritable();

        // Define image dimensions
        const width = 25000; // Width of the image
        const height = 25000; // Height of the image

        // BMP Header (14 bytes)
        const bmpHeader = new ArrayBuffer(14);
        const bmpHeaderView = new DataView(bmpHeader);
        bmpHeaderView.setUint16(0, 0x4d42, true); // Signature 'BM'
        bmpHeaderView.setUint32(2, 54 + width * height, true); // File size
        bmpHeaderView.setUint32(10, 54, true); // Offset to pixel data

        // DIB Header (40 bytes)
        const dibHeader = new ArrayBuffer(40);
        const dibHeaderView = new DataView(dibHeader);
        dibHeaderView.setUint32(0, 40, true); // Header size
        dibHeaderView.setInt32(4, width, true); // Image width
        dibHeaderView.setInt32(8, -height, true); // Image height (negative for top-down bitmap)
        dibHeaderView.setUint16(12, 1, true); // Number of color planes
        dibHeaderView.setUint16(14, 24, true); // Bits per pixel (24 for RGB)
        dibHeaderView.setUint32(20, width * height * 3, true); // Image size

        // Write headers
        await writableStream.write(new Uint8Array(bmpHeader));
        await writableStream.write(new Uint8Array(dibHeader));

        // Generate and write pixel data
        const rowPadding = (4 - ((width * 3) % 4)) % 4; // BMP rows are padded to 4-byte boundaries
        const pixelRow = new Uint8Array(width * 3 + rowPadding); // One row of pixels, including padding

        // for (let y = 0; y < height; y++) {
        //     for (let x = 0; x < width; x++) {
        //         const offset = x * 3;
        //         // Simple black and white pattern: alternate rows or columns
        //         const color = x % 2 === y % 2 ? 0 : 255; // Checkerboard pattern
        //         pixelRow[offset] = color; // Blue
        //         pixelRow[offset + 1] = color; // Green
        //         pixelRow[offset + 2] = color; // Red
        //     }
        //     await writableStream.write(pixelRow);
        // }
        for (let x = 0; x < width; x++) {
            const offset = x * 3;
            pixelRow[offset] = 0; // Blue
            pixelRow[offset + 1] = 0; // Green
            pixelRow[offset + 2] = 255; // Red
        }

        for (let y = 0; y < height; y++) {
            await writableStream.write(pixelRow);
        }

        // Close the writable stream
        await writableStream.close();
        console.log('BMP image successfully written!');
    } catch (error) {
        console.error('Error saving BMP image:', error);
    }
}

// Call the function to execute the BMP generation and saving process
//   generateAndSaveLargeBMP();
