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
            style={{ left: `${state.x}px`, top: `${state.y}px` }}
            className="absolute z-10 bg-white rounded-lg shadow-lg p-6 bg-opacity-90"
        >
            <form className="space-y-4">
                <div>
                    <label
                        htmlFor="format"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                        Image Format
                    </label>
                    <select
                        id="format"
                        value={state.selectedFormat}
                        onChange={e =>
                            onSelectFormat(e.target.value as MenuWidgetState['selectedFormat'])
                        }
                        className={inputBaseClass}
                    >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                    </select>
                </div>
                <div className="flex gap-4">
                    <div>
                        <label
                            htmlFor="width"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Width (px)
                        </label>
                        <input
                            type="number"
                            name="width"
                            id="width"
                            min="1"
                            max="9999"
                            onChange={onWidthChange}
                            value={state.width}
                            className={inputBaseClass}
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
                            type="number"
                            name="height"
                            id="height"
                            min="1"
                            max="9999"
                            onChange={onHeightChange}
                            value={state.height}
                            className={inputBaseClass}
                            required
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onSave}
                    className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent"
                >
                    Create Image
                </button>
            </form>
        </section>
    );
};

export default MenuWidget;
