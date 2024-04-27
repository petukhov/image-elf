import { FormEvent, useCallback, useState } from 'react';
import { ImageFormat } from '../types';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MenuWidgetState {
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
    state,
    textAlign = 'left',
}: MenuWidgetProps) => {
    const [isCreatingImg, setIsCreatingImg] = useState(false);

    const saveWrapper = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setIsCreatingImg(true);
            setTimeout(() => {
                onSave();
                setIsCreatingImg(false);
            }, 30);
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
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
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
            <button
                className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary focus-visible:ring-accent"
                type="submit"
            >
                {isCreatingImg ? 'Creating...' : 'Create Image'}
            </button>
        </form>
    );
};

export default MenuWidget;
