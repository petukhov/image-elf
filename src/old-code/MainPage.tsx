/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from 'react';
import '../layout.css';
import Header from './Header';
import KonvaWrapper from './konva-wrapper';

function download(filename, dataurl) {
    const element = document.createElement('a');

    element.setAttribute('href', dataurl);
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

const initialState = {
    width: 0,
    height: 0,
    imgWidth: 0,
    imgHeight: 0,
    format: 'png',
};

const konvaStuff = new KonvaWrapper();

const IndexPage = () => {
    const downloadWrapper = useRef() as any;

    const [settings, setSettings] = useState(initialState);

    useEffect(() => {
        console.warn('SETTING UP KONVA');
        konvaStuff.create(setSettings);
    }, []);

    useEffect(() => {
        if (downloadWrapper.current) {
            konvaStuff.renderRect(
                settings.width,
                settings.height,
                settings.imgWidth,
                settings.imgHeight,
                (settings as any).x,
                (settings as any).y,
            );
        }
        downloadWrapper.current = () =>
            download(
                'img.' + settings.format,
                konvaStuff.getDataUrl(settings.imgWidth, settings.imgHeight),
            );
    }, [settings]);

    return (
        <>
            <Header
                settings={settings}
                onSettingsChange={setSettings}
                onSave={() => downloadWrapper.current()}
            />
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0 1.0875rem 1.45rem`,
                    paddingBottom: 0,
                    marginLeft: 0,
                    paddingLeft: 0,
                }}
            >
                <main>
                    <div id="container"></div>
                    <div id="cover" className="hide"></div>
                    <div className="animate-character">THIS IS OLD CODE! THIS IS OLD CODE!</div>
                </main>
            </div>
        </>
    );
};

export default IndexPage;