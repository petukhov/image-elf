export async function generateAndSaveLargeFile() {
    try {
        // Prompt the user to select a file location and create a file handle
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'largeFile.txt',
            types: [
                {
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt'],
                    },
                },
            ],
        });

        // Create a writable stream to the file
        const writableStream = await fileHandle.createWritable();

        // Generate and write data to the file in chunks
        for (let i = 0; i < 80000; i++) {
            // Adjust the iteration count as needed
            const chunk = `This is line ${i + 1}\n`; // Generate a chunk of data
            await writableStream.write(chunk); // Write the chunk to the file
        }

        // Close the writable stream when done
        await writableStream.close();
        console.log('File successfully written!');
    } catch (error) {
        console.error('Error saving file:', error);
    }
}

// Call the function to execute the file generation and saving process
// generateAndSaveLargeFile();
