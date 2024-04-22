/// <reference types="vite-plugin-svgr/client" />
import { useCallback, useState } from 'react';
import Logo from '../assets/logo-white.svg?react';

const inputBaseClass =
    'text-center block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

const DATA_URL_SAMPLE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEDSURBVEhLtZJBEoMwDAP7lr6nn+0LqUGChsVOwoGdvTSSNRz6Wh7jxvT7+wn9Y4LZae0e+rXLeBqjh45rBtOYgy4V9KYxlOpqRjmNiY4+uJBP41gOI5BM40w620AknTVwGgfSWQMK0tnOaRpV6ewCatLZxn8aJemsAGXp7JhGLBX1wYlUtE4jkIpnwKGM9xeepG7mwblMpl2/CUbCJ7+6CnQzAw5lvD/8DxGIpbMClKWzdjpASTq7gJp0tnGaDlCVzhpQkM52OB3gQDrbQCSdNSTTAc7kMAL5dIDjjj64UE4HmEh1NaM3HWAIulQwmA4wd+i4ZjwdYDR00GqWsyPrizLD76QCPOHqP2cAAAAAElFTkSuQmCC';

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

    const handleSelectFormat = useCallback((format: 'png' | 'jpeg') => {
        setState({ ...state, selectedFormat: format });
    }, []);

    const handleSave = useCallback(() => {
        downloadImage('img.' + state.selectedFormat, DATA_URL_SAMPLE);
    }, []);

    return (
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
                                onChange={e => handleSelectFormat(e.target.value as 'png' | 'jpeg')}
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
    );
};

export default TouchPage;
