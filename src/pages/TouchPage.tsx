/// <reference types="vite-plugin-svgr/client" />
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '../assets/logo-white.svg?react';
import Konva from 'konva';
import { toUIVal } from '../services/utils';

const inputBaseClass =
    'text-center block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

const createImageDataUrl = (tempStage: Konva.Stage, width: number, height: number) => {
    // creating a temporary konva stage and layer
    const tempLayer = new Konva.Layer();
    tempStage.add(tempLayer);

    // creating the tempBox based on the image state
    const tempBox = new Konva.Rect({
        x: 0,
        y: 0,
        fillLinearGradientColorStops: [0, '#2AE5BC', 0.5, '#5BD8BD', 1, '#99E0D1'],
        listening: false,
    });
    tempLayer.add(tempBox);
    tempBox.size({
        width: toUIVal(width),
        height: toUIVal(height),
    });

    // update box gradient
    tempBox.fillLinearGradientStartPoint({ x: tempBox.x(), y: tempBox.y() });
    tempBox.fillLinearGradientEndPoint({
        x: tempBox.x() + tempBox.width(),
        y: tempBox.y() + tempBox.height(),
    });

    // cloning the text to the temporary layer, updating the size, and centering it
    const tempText = new Konva.Text({
        x: 0,
        y: 0,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: 'white',
        align: 'center',
        verticalAlign: 'middle',
        listening: false,
    });
    tempLayer.add(tempText);
    tempText.fontSize(toUIVal(tempText.fontSize()));
    tempText.size({
        width: toUIVal(width),
        height: toUIVal(height),
    });
    tempText.align('center');

    // rendering the temporary layer to the data url
    const res = tempStage.toDataURL({
        x: tempBox.x(),
        y: tempBox.y(),
        width: tempBox.width(),
        height: tempBox.height(),
    });

    // destroying the temporary layer and showing the main one again
    tempLayer.destroy();
    tempStage.destroy();

    return res;
};

function downloadImage(fileName, dataUrl) {
    const element = document.createElement('a');
    element.setAttribute('href', dataUrl);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

interface CreateImageType {
    selectedFormat: 'png' | 'jpeg';
    width: number;
    height: number;
}

const TouchPage = () => {
    const [state, setState] = useState<CreateImageType>({
        selectedFormat: 'png',
        width: 100,
        height: 100,
    });

    const [count, setCount] = useState(0);

    const konvaStageRef = useRef<Konva.Stage>();

    useEffect(() => {
        const konvaStage = new Konva.Stage({ container: 'temp-canvas', width: 0, height: 0 });
        konvaStageRef.current = konvaStage;
    }, []);

    const handleSelectFormat = useCallback((format: 'png' | 'jpeg') => {
        setState({ ...state, selectedFormat: format });
    }, []);

    const handleSave = () => {
        if (!konvaStageRef.current) return;
        const dataUrl = createImageDataUrl(konvaStageRef.current, state.width, state.height);
        downloadImage(count + 'img.' + state.selectedFormat, dataUrl);
        setCount(count + 1);
    };

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
                                    htmlFor="format"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Image Format
                                </label>
                                <select
                                    id="format"
                                    value={state.selectedFormat}
                                    onChange={e =>
                                        handleSelectFormat(e.target.value as 'png' | 'jpeg')
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
                                        onChange={e =>
                                            setState({ ...state, width: parseInt(e.target.value) })
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
                                        onChange={e =>
                                            setState({ ...state, height: parseInt(e.target.value) })
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
                        <p>Unfortunately, touch devices are not supported at this time</p>
                        <p>Please use a desktop browser to access the full feature of Image Elf</p>
                    </footer>
                </div>
            </div>
            <div id="temp-canvas"></div>
        </>
    );
};

export default TouchPage;
