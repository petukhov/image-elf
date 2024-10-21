import { FormEvent, useCallback } from 'react';
import { ImageFormat } from '../types';

export interface MenuWidgetState {
    width: number;
    height: number;
    selectedFormat: ImageFormat;
    creating: boolean;
    multiplierOn: boolean;
}

export interface MenuWidgetProps {
    onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onSelectFormat: (format: ImageFormat) => void;
    onMultiplierToggle?: () => void;
    state: MenuWidgetState;
    textAlign?: 'left' | 'center' | 'right';
}

const inputBaseClass =
    'block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-accent focus:border-accent focus-visible:ring-accent';

const labelBaseClass = 'block mb-2 text-sm font-medium text-gray-900';

const MenuWidget = ({
    onWidthChange,
    onHeightChange,
    onSave,
    onSelectFormat,
    onMultiplierToggle,
    state,
    textAlign = 'left',
}: MenuWidgetProps) => {
    const saveWrapper = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSave();
        },
        [onSave],
    );

    const textAlignClass = `text-${textAlign}`;
    const labelClass = `${textAlignClass} ${labelBaseClass}`;
    const inputClass = `${textAlignClass} ${inputBaseClass}`;

    return (
        <form className="space-y-4" onSubmit={saveWrapper}>
            <div>
                <label className={labelClass} htmlFor="selectedFormat">
                    Image Format
                </label>
                <select
                    className={inputClass}
                    name="format"
                    onChange={e => onSelectFormat(e.target.value as ImageFormat)}
                    value={state.selectedFormat}
                >
                    <option value={ImageFormat.JPEG}>JPEG</option>
                    <option value={ImageFormat.PNG}>PNG</option>
                </select>
            </div>
            <div className="flex gap-4">
                <div>
                    <label className={labelClass} htmlFor="width">
                        Width (px)
                    </label>
                    <input
                        className={inputClass}
                        min="1"
                        name="width"
                        onChange={onWidthChange}
                        type="number"
                        value={state.width > 0 ? state.width : ''}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="height" className={labelClass}>
                        Height (px)
                    </label>
                    <input
                        className={inputClass}
                        min="1"
                        name="height"
                        onChange={onHeightChange}
                        type="number"
                        value={state.height > 0 ? state.height : ''}
                        required
                    />
                </div>
            </div>
            <div className="flex items-center">
                        <input defaultChecked={state.multiplierOn} id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:border-accent"
                            onClick={onMultiplierToggle}/>
                        <label htmlFor="checked-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">10x size</label>
                    </div>
            <button
                className="w-full text-white bg-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-secondary
                           focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent disabled:bg-accent"
                type="submit"
                disabled={state.creating}
            >
                {state.creating ? 'Generating...' : 'Generate Image'}
            </button>
        </form>
    );
};

export default MenuWidget;
