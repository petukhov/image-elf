import { useCallback, useEffect, useRef, useState } from 'react';
import MenuWidget from '../components/MenuWidget';
import '../layout.css';
import KonvaWrapper, { CanvasRenderState } from '../services/konva-wrapper';
import { toInternalVal, toUIVal } from '../services/utils';

/** The default state is when the canvas is empty and it's the same size as the browser window. */
const getDefaultCanvasState = (): CanvasRenderState => ({
    // setting x and y to -1 to avoid showing the axis/ticks
    // when the app shows up and before the user hovers over the canvas

    /** x and y are the top left corner of the rectangle */
    x: -1,
    y: -1,
    /** width and height are the dimensions of the rectangle */
    width: 0,
    height: 0,
    /** the text shown in the middle of the rectangle */
    text: '',
    /** the width of the canvas */
    canvasWidth: window.innerWidth,
    /** the height of the canvas */
    canvasHeight: window.innerHeight,
});

const initialState = {
    /** whether the user is dragging over the canvas the mouse down, making the rectangle larger or smaller. */
    isDragging: false,
    /** whether the Menu widget with the save button and other settings visible */
    isMenuWidgetVisible: false,
    /** the currently selected image format for the generated image */
    selectedFormat: 'png' as 'png' | 'jpeg',
    /** the state of the HTML5 Canvas passed to KonvaWrapper's render() method. */
    canvasState: getDefaultCanvasState(),
};

const CANVAS_ID = 'canvas-id';

function downloadImage(fileName, dataUrl) {
    const element = document.createElement('a');
    element.setAttribute('href', dataUrl);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/** The text shown in the middle of the export image. */
function imageText(width: number, height: number) {
    return `${toUIVal(width)} x ${toUIVal(height)}`;
}

const MainPage = () => {
    const [appState, setAppState] = useState(initialState);
    const konvaWrapperRef = useRef<KonvaWrapper>();

    useEffect(() => {
        const wrapper = new KonvaWrapper(CANVAS_ID, window.innerWidth, window.innerHeight);
        konvaWrapperRef.current = wrapper;
        wrapper.on('mousedown', ({ evt }) => {
            setAppState(state => {
                return {
                    ...state,
                    isDragging: true,
                    isMenuWidgetVisible: false,
                    canvasState: {
                        ...state.canvasState,
                        x: evt.clientX,
                        y: evt.clientY,
                        width: 0,
                        height: 0,
                    },
                };
            });
        });
        wrapper.on('mouseup', ({ evt }) => {
            setAppState(state => {
                const shouldShowMenu =
                    evt.layerX > state.canvasState.x && evt.layerY > state.canvasState.y;
                return shouldShowMenu
                    ? {
                          ...state,
                          isDragging: false,
                          isMenuWidgetVisible: true,
                      }
                    : {
                          ...state,
                          isDragging: false,
                          isMenuWidgetVisible: false,
                      };
            });
        });
        wrapper.on('mousemove', ({ evt }) => {
            evt.stopPropagation();

            setAppState(state => {
                if (!state.isDragging) {
                    if (!state.isMenuWidgetVisible) {
                        return {
                            ...state,
                            canvasState: {
                                ...state.canvasState,
                                x: evt.clientX,
                                y: evt.clientY,
                            },
                        };
                    }
                    return state;
                }

                const newWidth = evt.layerX - state.canvasState.x;
                const newHeight = evt.layerY - state.canvasState.y;

                if (newWidth < 0 || newHeight < 0) {
                    return state;
                }

                return {
                    ...state,
                    canvasState: {
                        ...state.canvasState,
                        width: newWidth,
                        height: newHeight,
                        text: imageText(newWidth, newHeight),
                    },
                };
            });
        });

        // we want to hide all the items on the canvas if the user's mouse leaves the window.
        const callback = () => {
            setAppState(state => {
                return {
                    ...state,
                    isDragging: false,
                    isMenuWidgetVisible: false,
                    canvasState: getDefaultCanvasState(),
                };
            });
        };
        document.addEventListener('mouseleave', callback);
        return () => {
            document.removeEventListener('mouseleave', callback);
            konvaWrapperRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        konvaWrapperRef.current?.render(appState.canvasState);
    }, [appState.canvasState]);

    useEffect(() => {
        const handleResize = () => {
            setAppState(state => {
                return {
                    ...state,
                    isDragging: true,
                    isMenuWidgetVisible: false,
                    canvasState: {
                        ...state.canvasState,
                        canvasWidth: window.innerWidth,
                        canvasHeight: window.innerHeight,
                    },
                };
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleHeightInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const height = toInternalVal(+e.target.value);
        setAppState(state => ({
            ...state,
            canvasState: {
                ...state.canvasState,
                text: imageText(state.canvasState.width, height),
                height,
            },
        }));
    }, []);

    const handleWidthInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const width = toInternalVal(+e.target.value);
        setAppState(state => ({
            ...state,
            canvasState: {
                ...state.canvasState,
                text: imageText(width, state.canvasState.height),
                width,
            },
        }));
    }, []);

    const handleSelectFormat = useCallback((format: 'png' | 'jpeg') => {
        setAppState(state => ({
            ...state,
            selectedFormat: format,
        }));
    }, []);

    const handleSave = useCallback(() => {
        downloadImage('img.' + appState.selectedFormat, konvaWrapperRef.current?.getDataUrl());
    }, [appState]);

    return (
        <>
            {appState.isMenuWidgetVisible && (
                <MenuWidget
                    top={appState.canvasState.y + appState.canvasState.height - 100}
                    left={appState.canvasState.x + appState.canvasState.width - 100}
                    onHeightChange={handleHeightInput}
                    onWidthChange={handleWidthInput}
                    onSelectFormat={handleSelectFormat}
                    onSave={handleSave}
                    state={{
                        selectedFormat: appState.selectedFormat,
                        width: toUIVal(appState.canvasState.width),
                        height: toUIVal(appState.canvasState.height),
                    }}
                />
            )}
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0 1.0875rem 1.45rem`,
                    paddingBottom: 0,
                    marginLeft: 0,
                    paddingLeft: 0,
                }}
            >
                <main>
                    <div id={CANVAS_ID}></div>
                    <div className="animate-character">Click & drag to produce an image!</div>
                </main>
            </div>
        </>
    );
};

export default MainPage;
