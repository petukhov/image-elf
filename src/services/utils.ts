import Konva from 'konva';

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

/** Creates a temporary element to download a dataUrl as a specific filename */
export const downloadFile = (fileName: string, dataUrl: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', dataUrl);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

/** Creates the data url for the image to download */
export const createImageDataUrl = (width: number, height: number) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // creating a temporary konva stage and layer
    const tempStage = new Konva.Stage({ container, width: 0, height: 0 });
    const tempLayer = new Konva.Layer();
    tempStage.add(tempLayer);

    // creating the tempBox based on the image state
    const tempBox = new Konva.Rect({
        fillLinearGradientColorStops: [0, '#2AE5BC', 0.5, '#5BD8BD', 1, '#99E0D1'],
        fillLinearGradientEndPoint: { x: width, y: height },
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        height: height,
        listening: false,
        width: width,
        x: 0,
        y: 0,
    });
    tempLayer.add(tempBox);

    // add a temporary text to the temporary layer, updating the size, and centering it
    const tempText = new Konva.Text({
        align: 'center',
        fill: 'white',
        fontFamily: 'Arial',
        fontSize: Math.min(width, height) / 10,
        fontStyle: 'bold',
        height: height,
        listening: false,
        text: imageText(width, height),
        verticalAlign: 'middle',
        width: width,
        x: tempBox.x(),
        y: tempBox.y(),
    });
    tempLayer.add(tempText);

    // rendering the temporary layer to the data url
    const res = tempStage.toDataURL({
        height: tempBox.height(),
        width: tempBox.width(),
        x: tempBox.x(),
        y: tempBox.y(),
    });

    // destroying the temporary stage and the container
    tempStage.destroy();
    document.body.removeChild(container);

    return res;
};
