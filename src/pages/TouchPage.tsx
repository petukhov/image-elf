import { useCallback, useState } from 'react';
import Logo from '../assets/logo-white.svg?react';
import { createImageDataUrl, downloadFile } from '../services/utils';
import { ImageFormat } from '../types';
import ImageEditor, { MenuWidgetState } from '../components/ImageEditor';

const TouchPage = () => {
    const [state, setState] = useState<MenuWidgetState>({
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

    const handleWidthInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const width = +e.target.value;
            setState({ ...state, width });
        },
        [state],
    );

    const handleHeightInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const height = +e.target.value;
            setState({ ...state, height });
        },
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
                <main className="m-6">
                    <section className="bg-white rounded-lg shadow-lg p-6">
                        <ImageEditor
                            textAlign="center"
                            onHeightChange={handleHeightInput}
                            onWidthChange={handleWidthInput}
                            onSelectFormat={handleSelectFormat}
                            onSave={handleSave}
                            state={{
                                width: state.width,
                                height: state.height,
                                selectedFormat: state.selectedFormat,
                            }}
                        />
                    </section>
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
