import React, { useState, useRef, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import KonvaWrapper from '../services/konva-wrapper';
import Header from '../components/header';
import SEO from '../components/seo';

import '../components/layout.css';

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
  width: 200,
  height: 150,
  format: 'png'
};

const konvaStuff = new KonvaWrapper();

const IndexPage = () => {
  
  const downloadWrapper = useRef();

  const [settings, setSettings] = useState(initialState);

  useEffect(() => {
    // console.warn('USE EFFECT', settings);
    konvaStuff.renderRect(settings.width, settings.height);
    downloadWrapper.current = () => download('img.' + settings.format, konvaStuff.getDataUrl());
  }, [settings]);
  
  useEffect(() => {
    console.warn('SETTING UP KONVA');
    konvaStuff.create(setSettings);
    konvaStuff.renderRect(initialState.width, initialState.height);
  }, []);

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header 
        siteTitle={data.site.siteMetadata.title} 
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
          <SEO title="Home" />
          <div id="container"></div>
        </main>
      </div>
    </>
  );
};

export default IndexPage
