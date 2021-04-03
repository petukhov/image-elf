import React, { useState, useRef, useEffect } from "react"
// import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import Konva from 'konva';

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
  
  // let box, complexText, layer;
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

  // function updateDimensions(dimensions) {

  // }

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
      console.log(format.current);
      download('img.' + format.current, getDataUrl());
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
      setDimensions({width: evt.layerX, height: evt.layerY});
      updateSize(evt.layerX, evt.layerY);
    });
  }, []);


  return (
    <Layout onSettingsChange={handleSettingsChange} dimensions={dimensions}>
      <SEO title="Home" />
      <div id="container"></div>
    </Layout>
  );
};

export default IndexPage
