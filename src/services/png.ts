import pako from 'pako';

export async function generateAndStreamSimplePNG() {
    // Define the PNG signature
    const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

    // Create IHDR chunk
    const width = 100;
    const height = 100;
    const bitDepth = 8;
    const colorType = 2; // Truecolor
    const compressionMethod = 0;
    const filterMethod = 0;
    const interlaceMethod = 0;

    const ihdrData = new Uint8Array([
        ...toBytes(width, 4),
        ...toBytes(height, 4),
        bitDepth,
        colorType,
        compressionMethod,
        filterMethod,
        interlaceMethod,
    ]);

    const ihdrChunk = createChunk('IHDR', ihdrData);

    // Create IDAT chunk (single color: red)
    const color = [255, 120, 0]; // RGB for red
    const row = new Uint8Array([0, ...color].concat(...Array(width - 1).fill(color)));
    const idatData = new Uint8Array(pako.deflate(new Uint8Array(Array(height).fill(row).flat())));
    const idatChunk = createChunk('IDAT', idatData);

    // Create IEND chunk
    const iendChunk = createChunk('IEND', new Uint8Array());

    // Use the File System Access API to save the file
    const options = {
        suggestedName: 'name.png',
        // types: [
        //     {
        //         description: 'PNG Image',
        //         // accept: { 'image/png': ['. }
        //         accept: {
        //             'application/octet-stream': ['.png'],
        //         },
        //     },
        // ],
    };

    try {
        const handle = await window.showSaveFilePicker(options);
        const writableStream = await handle.createWritable();

        // Stream the PNG data to the file
        await writableStream.write(pngSignature);
        await writableStream.write(ihdrChunk);
        await writableStream.write(idatChunk);
        await writableStream.write(iendChunk);
        await writableStream.close();

        console.log('File saved successfully.');
    } catch (error) {
        console.error('Failed to save file:', error);
    }
}

// Helper functions
function createChunk(type: string, data: Uint8Array): Uint8Array {
    const typeBytes = new TextEncoder().encode(type);
    const length = data.length;
    const crc = crc32(new Uint8Array([...typeBytes, ...data]));
    const chunk = new Uint8Array(8 + length + 4);
    chunk.set(toBytes(length, 4), 0);
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    chunk.set(toBytes(crc, 4), 8 + length);
    return chunk;
}

function toBytes(value: number, length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[length - 1 - i] = value & 0xff;
        value >>= 8;
    }
    return bytes;
}

function crc32(data: Uint8Array): number {
    let crc = -1;
    for (let i = 0; i < data.length; i++) {
        const byte = data[i];
        crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
    }
    return (crc ^ -1) >>> 0;
}

const crcTable = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    return c;
});

// Call the function to start the process
// generateAndStreamSimplePNG();
