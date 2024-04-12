import { useEffect, useState } from 'react';
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
                    evt.layerX > state.canvasState.x &&
                    evt.layerY > state.canvasState.y;
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
                        console.log('here');
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

    return (
        <>
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
                    <div id="cover" className="hide"></div>
                    <div className="animate-character">
                        Click & drag to produce an image!
                    </div>
                </main>
            </div>
        </>
    );
};

export default MainPage2;
