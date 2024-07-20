import { useCallback, useState } from 'react';
import GithubLogo from '../assets/github-logo.svg?react';
import Logo from '../assets/logo-white.svg?react';
import ImageEditor, { MenuWidgetState } from '../components/ImageEditor';
import { createImageDataUrl, downloadFile } from '../services/utils';
import { ImageFormat } from '../types';

const TouchPage = () => {
    const [state, setState] = useState<MenuWidgetState>({
        selectedFormat: 'png',
        width: 100,
        height: 100,
    });

    const handleSave = useCallback(() => {
        createImageDataUrl(state.width, state.height, state.selectedFormat)
        .then(blob => {
            downloadFile('img.' + state.selectedFormat, blob);
        })
        .catch(error => {
            console.error('Error generating image:', error);
        })
        .finally(() => console.log("Operation completed"));
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
        <div className="_h-screen-safe w-screen bg-gradient-to-br text-white from-primary via-secondary to-accent p-6">
            <div className="_fix-height-safe-area flex flex-col items-center text-center h-full">
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
                    <div className="flex justify-center">
                        <a
                            className="text-white"
                            target="_blank"
                            href="https://github.com/petukhov/project-k"
                        >
                            <GithubLogo width={30} height={30} />
                        </a>
                    </div>
                    <small>image-elf &copy; 2024</small>
                </footer>
            </div>
        </div>
    );
};

export default TouchPage;
