import { useCallback, useState } from 'react';
import Logo from '../assets/logo-white.svg?react';
import { createImageDataUrl, downloadFile } from '../services/utils';
import { ImageFormat } from '../types';

const inputBaseClass =
    'text-center block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

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
                                className="block mb-2 text-sm font-medium text-gray-900"
                                htmlFor="selectedFormat"
                            >
                                Image Format
                            </label>
                            <select
                                className={inputBaseClass}
                                name="selectedFormat"
                                value={state.selectedFormat}
                                onChange={evt =>
                                    handleSelectFormat(evt.target.value as ImageFormat)
                                }
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="width"
                                >
                                    Width (px)
                                </label>
                                <input
                                    className={inputBaseClass}
                                    type="number"
                                    name="width"
                                    min="1"
                                    onChange={evt => handleWidthInput(+evt.target.value)}
                                    value={state.width}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="height"
                                >
                                    Height (px)
                                </label>
                                <input
                                    className={inputBaseClass}
                                    type="number"
                                    name="height"
                                    min="1"
                                    onChange={evt => handleHeightInput(+evt.target.value)}
                                    value={state.height}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent"
                            type="button"
                            onClick={handleSave}
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
    );
};

export default TouchPage;
