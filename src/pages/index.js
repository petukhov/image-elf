import React, { useState, useRef, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby"
import Konva from 'konva';

import Header from "../components/header";
import SEO from "../components/seo";

import "../components/layout.css";

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

const IndexPage = () => {
  
  const konvaElements = useRef({});
  const downloadWrapper = useRef();

  const [settings, setSettings] = useState(initialState);

  const renderRect = (width, height) => {
    const { box, complexText, layer} = konvaElements.current;
    if (!box) return;
    box.size({
      width,
      height
    });
    complexText.size({
      width,
      height
    });
    complexText.text(`${width}x${height}`);
    layer.clear();
    layer.draw();
  }

  const getDataUrl = () => {
    const { stage, box } = konvaElements.current;
    return stage.toDataURL({
      x: box.x(),
      y: box.y(),
      width: box.width(),
      height: box.height()
    });
  };

  useEffect(() => {
    // console.warn('USE EFFECT', settings);
    renderRect(settings.width, settings.height);
    downloadWrapper.current = () => download('img.' + settings.format, getDataUrl());
  }, [settings]);
  
  useEffect(() => {
    console.warn('SETTING UP KONVA');

    const stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth - 400,
      height: window.innerHeight - 100
    });
    konvaElements.current.stage = stage;

    const layer = new Konva.Layer();
    konvaElements.current.layer = layer;
    stage.add(layer);

    const box = new Konva.Rect({
      x: 0,
      y: 0,
      fill: '#00a2FF',
    });
    layer.add(box);
    konvaElements.current.box = box;

    const complexText = new Konva.Text({
      x: 0,
      y: 0,
      fontSize: 20,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: 'black',
      padding: 20,
      align: 'center',
      verticalAlign: 'middle'
    });
    layer.add(complexText);
    konvaElements.current.complexText = complexText;

    renderRect(initialState.width, initialState.height);

    stage.on('click', ({ evt }) => {
      setSettings(settings => ({ ...settings, width: evt.layerX, height: evt.layerY }));
      // downloadWrapper.current();
    });

    let dragging = false;
    stage.on('mousedown', () => {
      dragging = true;
    });
    stage.on('mouseup mouseleave', () => {
      dragging = false;
    });
    stage.on('mousemove', ({ evt }) => {
      if (!dragging) return;
      setSettings(settings => ({ ...settings, width: evt.layerX, height: evt.layerY }));
    });
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
          paddingBottom: 0
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
