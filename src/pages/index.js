import React, { useState, useRef, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby"
import Konva from 'konva';

import Header from "../components/header";
import SEO from "../components/seo";

import "../components/layout.css";


function download(filename, dataurl) {
  var element = document.createElement('a');
  element.setAttribute('href', dataurl);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const IndexPage = () => {

  const format = useRef('png');
  
  const konvaElements = useRef({});

  const [dimensions, setDimensions] = useState({
    width: 100,
    height: 100
  });

  function handleSettingsChange(newSettings) {
    console.log('handleSettingsChange in index', newSettings);
    format.current = newSettings.format;
    setDimensions({
      width: newSettings.width, 
      height: newSettings.height
    });
  }

  function updateSize(width, height) {
    const { box, complexText, layer} = konvaElements.current;
    console.log('updating size 1', box, complexText);
    if (!box) return;
    console.log('updating size 2');
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

  useEffect(() => {
    console.log('getting called!', dimensions);
    updateSize(dimensions.width, dimensions.height);
  }, [dimensions]);
  
  useEffect(() => {

    const getDataUrl = () => {
      return stage.toDataURL({
        x: box.x(),
        y: box.y(),
        width: box.width(),
        height: box.height()
      });
    };

    const stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth - 400,
      height: window.innerHeight - 100
    });

    const layer = new Konva.Layer();
    konvaElements.current.layer = layer;
    stage.add(layer);

    const box = new Konva.Rect({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      fill: '#00a2FF',
    });
    layer.add(box);
    konvaElements.current.box = box;

    const complexText = new Konva.Text({
      x: 0,
      y: 0,
      text: '',
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


    layer.draw();

    console.log('rerun!!!!');
    stage.on('click', ({ evt }) => {
      setDimensions({width: evt.layerX, height: evt.layerY});
      updateSize(evt.layerX, evt.layerY);
      // download('img.' + format.current, getDataUrl());
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
      setDimensions({ width: evt.layerX, height: evt.layerY });
      updateSize(evt.layerX, evt.layerY);
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
        onSettingsChange={handleSettingsChange}
        dimensions={dimensions}/>
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
