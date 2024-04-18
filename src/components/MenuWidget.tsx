import 'tailwindcss/tailwind.css';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MenuWidgetState {
    width: number;
    height: number;
    selectedFormat: 'png' | 'jpeg';
}

export interface MenuWidgetProps {
    top: number;
    left: number;
    onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onSelectFormat: (format: 'png' | 'jpeg') => void;
    state: MenuWidgetState;
}

const MenuWidget = ({
    top,
    left,
    onWidthChange,
    onHeightChange,
    onSave,
    onSelectFormat,
    state,
}: MenuWidgetProps) => {
    return (
        <section
            style={{
                top: top + 'px',
                left: left + 'px',
            }}
            className="opacity-80 absolute z-10 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-52"
        >
            <div className="dropdown">
                <button className="dropbtn">
                    Format: {state.selectedFormat}
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <button onClick={() => onSelectFormat('png')}>PNG</button>
                    <button onClick={() => onSelectFormat('jpeg')}>JPEG</button>
                </div>
            </div>
            <div className="pop-up-line">
                <div className="navbar-text">Width:</div>
                <input
                    type="number"
                    name="num"
                    min="1"
                    max="9999"
                    onChange={onWidthChange}
                    value={state.width}
                ></input>
            </div>
            <div className="pop-up-line">
                <div className="navbar-text">Height:</div>
                <input
                    type="number"
                    name="num"
                    min="1"
                    max="9999"
                    onChange={onHeightChange}
                    value={state.height}
                ></input>
            </div>
            <button className="save-btn" onClick={onSave}>
                Save!
            </button>
        </section>
    );
};

export default MenuWidget;
