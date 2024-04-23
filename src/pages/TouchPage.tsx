/// <reference types="vite-plugin-svgr/client" />
import Konva from 'konva';
import { useCallback, useState } from 'react';
import Logo from '../assets/logo-white.svg?react';
import { downloadFile, imageText } from '../services/utils';
import { ImageFormat } from '../types';

const CANVAS_ID = 'canvas-id';
const inputBaseClass =
    'text-center block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

const createImageDataUrl = (width: number, height: number) => {
    // creating a temporary konva stage and layer
    const tempStage = new Konva.Stage({ container: CANVAS_ID, width: 0, height: 0 });
    const tempLayer = new Konva.Layer();
    tempStage.add(tempLayer);

    // creating the tempBox based on the image state
    const tempBox = new Konva.Rect({
        fillLinearGradientColorStops: [0, '#2AE5BC', 0.5, '#5BD8BD', 1, '#99E0D1'],
        fillLinearGradientEndPoint: { x: width, y: height },
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        height: height,
        listening: false,
        width: width,
        x: 0,
        y: 0,
    });
    tempLayer.add(tempBox);

    // add a temporary text to the temporary layer, updating the size, and centering it
    const tempText = new Konva.Text({
        align: 'center',
        fill: 'white',
        fontFamily: 'Arial',
        fontSize: Math.min(width, height) / 10,
        fontStyle: 'bold',
        height: height,
        listening: false,
        text: imageText(width, height),
        verticalAlign: 'middle',
        width: width,
        x: tempBox.x(),
        y: tempBox.y(),
    });
    tempLayer.add(tempText);

    // rendering the temporary layer to the data url
    const res = tempStage.toDataURL({
        height: tempBox.height(),
        width: tempBox.width(),
        x: tempBox.x(),
        y: tempBox.y(),
    });

    // destroying the temporary layer and showing the main one again
    tempStage.destroy();

    return res;
};

interface CreateImageType {
    selectedFormat: ImageFormat;
    width: number;
    height: number;
}

const TouchPage = () => {
    const [state, setState] = useState<CreateImageType>({
        selectedFormat: 'png',
        width: 100,
        height: 100,
    });

    const handleSave = useCallback(() => {
        const dataUrl = createImageDataUrl(state.width, state.height);
        downloadFile('img.' + state.selectedFormat, dataUrl);
    }, [state]);

    const handleSelectFormat = useCallback(
        (selectedFormat: ImageFormat) => setState({ ...state, selectedFormat }),
        [state],
    );

    const handleWidthInput = useCallback((width: number) => setState({ ...state, width }), [state]);

    const handleHeightInput = useCallback(
        (height: number) => setState({ ...state, height }),
        [state],
    );

    return (
        <>
            <div className="w-screen h-screen bg-gradient-to-br text-white from-primary via-secondary to-accent p-6">
                <div className="flex flex-col items-center text-center h-full">
                    <header className="flex flex-col gap-4 mt-6">
                        <div className="flex flex-row gap-2 justify-center align-middle items-center">
                            <Logo width={30} height={30} />
                            <h1 className="text-3xl font-extrabold">Image Elf</h1>
                        </div>
                        <h2 className="text-xl font-bold mx-2">
                            Create custom pixel-perfect images with ease
                        </h2>
                    </header>
                    <main className="bg-white rounded-lg shadow-lg p-6 m-6">
                        <form className="space-y-4">
                            <div>
                                <label
                                    htmlFor="selectedFormat"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Image Format
                                </label>
                                <select
                                    name="selectedFormat"
                                    id="selectedFormat"
                                    value={state.selectedFormat}
                                    onChange={evt =>
                                        handleSelectFormat(evt.target.value as ImageFormat)
                                    }
                                    className={inputBaseClass}
                                >
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <label
                                        htmlFor="width"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Width (px)
                                    </label>
                                    <input
                                        type="number"
                                        name="width"
                                        id="width"
                                        min="1"
                                        onChange={evt =>
                                            handleWidthInput(parseInt(evt.target.value, 10))
                                        }
                                        value={state.width}
                                        className={inputBaseClass}
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="height"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Height (px)
                                    </label>
                                    <input
                                        type="number"
                                        name="height"
                                        id="height"
                                        min="1"
                                        onChange={evt =>
                                            handleHeightInput(parseInt(evt.target.value, 10))
                                        }
                                        value={state.height}
                                        className={inputBaseClass}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent"
                            >
                                Create Image
                            </button>
                        </form>
                    </main>
                    <footer className="flex flex-col justify-end gap-4 mx-4">
                        <p>
                            Set your desired dimensions, select from multiple image formats, and
                            download your creation instantly!
                        </p>
                        <small>image-elf &copy; 2024</small>
                    </footer>
                </div>
            </div>
            <div id={CANVAS_ID}></div>
        </>
    );
};

export default TouchPage;
