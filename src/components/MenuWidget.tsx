import 'tailwindcss/tailwind.css';
import { ImageFormat } from '../types';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MenuWidgetState {
    x: number;
    y: number;
    width: number;
    height: number;
    selectedFormat: ImageFormat;
}

export interface MenuWidgetProps {
    onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onSelectFormat: (format: ImageFormat) => void;
    state: MenuWidgetState;
}

const inputBaseClass =
    'block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

const MenuWidget = ({
    onWidthChange,
    onHeightChange,
    onSave,
    onSelectFormat,
    state,
}: MenuWidgetProps) => {
    return (
        <section
            className="absolute z-10 bg-white rounded-lg shadow-lg p-6 bg-opacity-90"
            style={{ left: `${state.x}px`, top: `${state.y}px` }}
        >
            <form className="space-y-4">
                <div>
                    <label
                        className="block mb-2 text-sm font-medium text-gray-900"
                        htmlFor="format"
                    >
                        Image Format
                    </label>
                    <select
                        className={inputBaseClass}
                        name="format"
                        onChange={e => onSelectFormat(e.target.value as ImageFormat)}
                        value={state.selectedFormat}
                    >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                    </select>
                </div>
                <div className="flex gap-4">
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor="width"
                        >
                            Width (px)
                        </label>
                        <input
                            className={inputBaseClass}
                            max="9999"
                            min="1"
                            name="width"
                            onChange={onWidthChange}
                            type="number"
                            value={state.width}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="height"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Height (px)
                        </label>
                        <input
                            className={inputBaseClass}
                            max="9999"
                            min="1"
                            name="height"
                            onChange={onHeightChange}
                            type="number"
                            value={state.height}
                            required
                        />
                    </div>
                </div>
                <button
                    className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent"
                    onClick={onSave}
                    type="button"
                >
                    Create Image
                </button>
            </form>
        </section>
    );
};

export default MenuWidget;
