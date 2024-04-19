import { useCallback, useEffect, useRef, useState } from 'react';
import MenuWidget from '../components/MenuWidget';
import '../layout.css';
import KonvaWrapper, { CanvasRenderState } from '../services/konva-wrapper';
import { toInternalVal, toUIVal } from '../services/utils';

const canvasState: CanvasRenderState = {
    // setting x and y to -1 to avoid showing the axis/ticks
    // when the app shows up and before the user hovers over the canvas
    x: -1,
    y: -1,
    width: 0,
    height: 0,
    text: '',
};

const initialState = {
    isDragging: false,
    isMenuWidgetVisible: false,
    selectedFormat: 'png' as 'png' | 'jpeg',
    canvasState,
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
        const wrapper = new KonvaWrapper(CANVAS_ID);
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
        return () => {
            konvaWrapperRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        konvaWrapperRef.current?.render(appState.canvasState);
    }, [appState.canvasState]);

    useEffect(() => {
        const handleResize = () => {
            konvaWrapperRef.current?.resizeStage();
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
