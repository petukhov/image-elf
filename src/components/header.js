// import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useState } from "react"

const Header = ({ siteTitle, onSettingsChange, dimensions}) => {

  const [settings, setSettings] = useState({
    format: 'png',
    width: dimensions.width,
    height: dimensions.height
  });
  
  if (dimensions.width !== settings.width || dimensions.height !== settings.height) {
    const newSettings = {...settings, ...dimensions};
    setSettings(newSettings);
  }

  function handleClickPNG(e) {
    e.preventDefault();
    console.log('The link was clicked.');
    const newSettings = {...settings, format: 'png'};
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }

  function handleClickJPEG(e) {
    e.preventDefault();
    console.log('The link was clicked.');
    const newSettings = {...settings, format: 'jpeg'};
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }

  function handleWidthChange(e) {
    const width = +e.target.value;
    const newSettings = {...settings, width};
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }

  function handleHeightChange(e) {
    const height = +e.target.value;
    const newSettings = {...settings, height};
    setSettings(newSettings);
    onSettingsChange(newSettings);
  }

  return (
    <header style={{
      background: '#333',
      marginBottom: `1.45rem`,
    }}>
      <div className="navbar">
        <a href="/">{siteTitle}</a>
        <div className="dropdown">
          <button className="dropbtn">
            Format: {settings.format}
              <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <a href="#" onClick={handleClickPNG}>PNG</a>
            <a href="#" onClick={handleClickJPEG}>JPEG</a>
          </div>
        </div>
        <div className="navbar-text">Width:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleWidthChange} value={dimensions.width}></input>
        <div className="navbar-text">Height:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleHeightChange} value={dimensions.height}></input>
      </div>
    </header>
  );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
