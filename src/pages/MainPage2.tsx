import { useCallback, useEffect, useState } from 'react';
import MenuWidget from '../components/MenuWidget';
import '../layout.css';
import KonvaWrapper2, { CanvasRenderState } from '../services/konva-wrapper2';

const canvasState: CanvasRenderState = {
    x: 0,
    y: 0,
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

const MainPage2 = () => {
    const [appState, setAppState] = useState(initialState);

    useEffect(() => {
        KonvaWrapper2.create(CANVAS_ID);

        window.document.addEventListener(
            'click',
            () => {
                // setAppState(state => ({
                //     ...state,
                //     isMenuWidgetVisible: false,
                //     canvasState: {
                //         ...state.canvasState,
                //         x: 0,
                //         y: 0,
                //         width: 0,
                //         height: 0,
                //         text: '',
                //     },
                // }));
            },
            { capture: true },
        );

        KonvaWrapper2.on('mousedown', ({ evt }) => {
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
        KonvaWrapper2.on('mouseup', ({ evt }) => {
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
        KonvaWrapper2.on('mousemove', ({ evt }) => {
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
                        text: `(${newWidth}, ${newHeight})`,
                    },
                };
            });
        });
        return () => {
            KonvaWrapper2.destroy();
        };
    }, []);

    useEffect(() => {
        KonvaWrapper2.render(appState.canvasState);
    }, [appState.canvasState]);

    const handleHeightInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const height = +e.target.value;
        setAppState(state => ({
            ...state,
            canvasState: {
                ...state.canvasState,
                height,
            },
        }));
    }, []);

    const handleWidthInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const width = +e.target.value;
        setAppState(state => ({
            ...state,
            canvasState: {
                ...state.canvasState,
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
        console.log('Saving');
    }, []);

    return (
        <>
            {appState.isMenuWidgetVisible && (
                <MenuWidget
                    top={appState.canvasState.y + appState.canvasState.height - 200}
                    left={appState.canvasState.x + appState.canvasState.width - 100}
                    onHeightChange={handleHeightInput}
                    onWidthChange={handleWidthInput}
                    onSelectFormat={handleSelectFormat}
                    onSave={handleSave}
                    state={{
                        selectedFormat: appState.selectedFormat,
                        width: appState.canvasState.width,
                        height: appState.canvasState.height,
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
                    {/* <div id="cover" className="hide"></div> */}
                    <div className="animate-character">Click & drag to produce an image!</div>
                </main>
            </div>
        </>
    );
};

export default MainPage2;
