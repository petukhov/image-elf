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
    const width = +e.target.value;
    onSettingsChange({...settings, width});
  }

  function handleHeightChange(e) {
    const height = +e.target.value;
    onSettingsChange({...settings, height});
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
        <input type="number" name="num" min="1" max="9999" onChange={handleWidthChange} value={settings.width}></input>
        <div className="navbar-text">Height:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleHeightChange} value={settings.height}></input>
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
