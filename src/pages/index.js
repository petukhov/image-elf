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

const OFFSET = 30;

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
      width: window.innerWidth,
      height: window.innerHeight - 54
    });
    konvaElements.current.stage = stage;

    const layer = new Konva.Layer();
    konvaElements.current.layer = layer;
    stage.add(layer);

    const box = new Konva.Rect({
      x: OFFSET,
      y: OFFSET,
      fill: '#00a2FF',
    });
    layer.add(box);
    konvaElements.current.box = box;

    const complexText = new Konva.Text({
      x: OFFSET,
      y: OFFSET,
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

    var horizontalLine = new Konva.Line({
      points: [OFFSET, OFFSET, window.innerWidth, OFFSET],
      stroke: 'rgb(0, 161, 0)',
      strokeWidth: 1,
      dash: [4, 6],
    });
    layer.add(horizontalLine);

    var verticalLine = new Konva.Line({
      points: [OFFSET, OFFSET, OFFSET, window.innerHeight],
      stroke: 'rgb(0, 161, 0)',
      strokeWidth: 1,
      dash: [4, 6],
    });
    layer.add(verticalLine);

    renderRect(initialState.width, initialState.height);

    stage.on('click', ({ evt }) => {
      if (!dragging) return;
      setSettings(settings => ({ ...settings, width: evt.layerX - OFFSET, height: evt.layerY - OFFSET }));
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
      setSettings(settings => ({ ...settings, width: evt.layerX - OFFSET, height: evt.layerY - OFFSET }));
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
