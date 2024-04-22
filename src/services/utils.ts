/**
 * The text values shown in the UI and the exported image size are calculated by multiplying the internal values by 10.
 * So if internal representation is 120px, in the UI it will be shown as 1200px, and in the exported image it will also be 1200px.
 */
export const toUIVal = (value: number): number => {
    return value * 10;
};

/**
 * Converting back to internal values. For example when handling the user input for the manual width and height changes.
 */
export const toInternalVal = (value: number): number => {
    return value / 10;
};

/** The text shown in the middle of the export image. */
export const imageText = (width: number, height: number) => {
    return `${width} x ${height}`;
};
