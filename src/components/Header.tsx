// import PropTypes from "prop-types";

const Header = ({ settings, onSettingsChange, onSave }) => {
  
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
    // if (width >= 1200) {
    //   width = 1200;
    // }
    onSettingsChange({ ...settings, width: Math.floor(width / 10), imgWidth });
  }

  function handleHeightChange(e) {
    let height = +e.target.value;
    const imgHeight = height;
    // if (height >= 500) {
    //   height = 500;
    // }
    onSettingsChange({ ...settings, height: Math.floor(height / 10), imgHeight });
  }

  return (
    <section style={{
      background: '#333',
      position: 'absolute',
      width: '200px',
      display: settings.menuVisible ? 'flex' : 'none',
      flexDirection: 'column',
      zIndex: 1,
      top:  settings.y + settings.height - 200 + 'px',
      left: settings.x + settings.width - 100 + 'px',
      opacity: 0.8,
      gap: '14px'
    }}>
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
      <div className="pop-up-line">
        <div className="navbar-text">Width:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleWidthChange} value={settings.imgWidth}></input>
      </div>
      <div className="pop-up-line">
        <div className="navbar-text">Height:</div>
        <input type="number" name="num" min="1" max="9999" onChange={handleHeightChange} value={settings.imgHeight}></input>
      </div>
      <button className="save-btn" onClick={onSave}>Save!</button>
    </section>
  );
}

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// }

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
