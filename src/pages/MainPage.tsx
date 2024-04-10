// import KonvaWrapper from '../components/KonvaWrapper';

// const MainPage = () => {
// 	return (
// 		<>
// 			{/* Sidebar? */}
// 			<KonvaWrapper />
// 		</>
// 	);
// };

// export default MainPage;

import { useState, useRef, useEffect } from 'react';
// import KonvaWrapper from '../services/konva-wrapper';
// import Header from '../components/header';

import '../layout.css';
import Header from '../components/Header';
import KonvaWrapper from '../services/konva-wrapper';

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
  format: 'png'
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
    //console.warn('USE EFFECT', settings);
    if (downloadWrapper.current) {
      konvaStuff.renderRect(settings.width, settings.height, settings.imgWidth, settings.imgHeight, (settings as any).x, (settings as any).y);
    }
    downloadWrapper.current = () => download(
      'img.' + settings.format, 
      konvaStuff.getDataUrl(settings.imgWidth, settings.imgHeight)
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
          paddingLeft: 0
        }}
      >
        <main>
          <div id="container"></div>
          <div id="cover" className="hide"></div>
          <div className="animate-character">Click & drag to produce an image!</div>
        </main>
      </div>
    </>
  );
};

export default IndexPage
