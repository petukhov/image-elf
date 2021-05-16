import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, settings, onSettingsChange, onSave}) => {
  
  function handleClickPNG(e) {
    e.preventDefault();
    onSettingsChange({...settings, format: 'png'});
  }

  function handleClickJPEG(e) {
    e.preventDefault();
    onSettingsChange({...settings, format: 'jpeg'});
  }

  function handleWidthChange(e) {
    let width = +e.target.value;
    const imgWidth = width;
    if (width >= 1200) {
      width = 1200;
    }
    onSettingsChange({ ...settings, width, imgWidth });
  }

  function handleHeightChange(e) {
    let height = +e.target.value;
    const imgHeight = height;
    if (height >= 500) {
      height = 500;
    }
    onSettingsChange({ ...settings, height, imgHeight });
  }

  return (
    <header style={{
      background: '#333'
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
        <input type="number" name="num" min="1" max="9999" onChange={handleWidthChange} value={settings.imgWidth}></input>
        <div className="navbar-text">Height:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleHeightChange} value={settings.imgHeight}></input>
        <button className="save-btn" onClick={onSave}>Save!</button>
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
