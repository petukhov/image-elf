import { useCallback, useState } from 'react';
import GithubLogo from '../assets/github-logo.svg?react';
import Logo from '../assets/logo-white.svg?react';
import ImageEditor, { MenuWidgetState } from '../components/ImageEditor';
import { CURRENT_YEAR, REPOSITORY_URL } from '../constants';
import { saveAsImage } from '../services/utils';
import { ImageFormat } from '../types';

const TouchPage = () => {
    const [state, setState] = useState<MenuWidgetState>({
        selectedFormat: ImageFormat.JPEG,
        width: 100,
        height: 100,
        creating: false,
        multiplierOn: true,
    });

    const handleSave = useCallback(() => {
        setState({ ...state, creating: true });
        saveAsImage(state.width, state.height, state.selectedFormat, () =>
            setState({ ...state, creating: false }),
        );
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
                    <h2 className="text-xl font-bold mx-2">Generate an image of any size</h2>
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
                                creating: state.creating,
                                multiplierOn: state.multiplierOn,
                            }}
                        />
                    </section>
                </main>
                <footer className="flex flex-col justify-end gap-4 mx-4">
                    <p>
                        Set your desired dimensions, select the image format, and download your
                        creation instantly!
                    </p>
                    <div className="flex justify-center">
                        <a className="text-white" target="_blank" href={REPOSITORY_URL}>
                            <GithubLogo width={30} height={30} />
                        </a>
                    </div>
                    <small>&copy;{CURRENT_YEAR} Image Elf</small>
                </footer>
            </div>
        </div>
    );
};

export default TouchPage;
