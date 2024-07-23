import { useCallback, useEffect, useRef, useState } from 'react';
import GithubLogo from '../assets/github-logo.svg?react';
import ImageEditor from '../components/ImageEditor';
import KonvaWrapper, { CanvasRenderState } from '../services/konva-wrapper';
import { imageText, saveAsImage, toInternalVal, toUIVal } from '../services/utils';
import { ImageFormat } from '../types';

const CANVAS_ID = 'canvas-id';

const WIDGET_WIDTH = 250; // approximately
const WIDGET_HEIGHT = 270; // approximately

// We want to place the menu widget "Create Image" button exactly under
// the mouse cursor when the user releases the mouse button.
const MOUSE_UP_PLACEMENT_X = 40;
const MOUSE_UP_PLACEMENT_Y = 210;

/** limit the position so widget never goes outside the borders of the window  */
const limitMenuWidgetXPos = (newX: number) => {
    return Math.max(0, Math.min(window.innerWidth - WIDGET_WIDTH, newX));
};
const limitMenuWidgetYPos = (newY: number) => {
    return Math.max(0, Math.min(window.innerHeight - WIDGET_HEIGHT, newY));
};

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
    /** the x position of the Menu widget */
    menuX: 0,
    /** the y position of the Menu widget */
    menuY: 0,
    /** the currently selected image format for the generated image */
    selectedFormat: ImageFormat.JPEG,
    /** the state of the HTML5 Canvas passed to KonvaWrapper's render() method. */
    canvasState: getDefaultCanvasState(),
};

const useDebounce = (fn: () => number[], delay: number) => {
    const thisTimeoutRef = useRef<number | null>(null);
    const internalTimeoutRefs = useRef<number[]>([]);

    return useCallback(() => {
        if (thisTimeoutRef.current) {
            clearTimeout(thisTimeoutRef.current);
            internalTimeoutRefs.current.forEach(clearTimeout);
        }
        thisTimeoutRef.current = window.setTimeout(() => {
            internalTimeoutRefs.current = fn();
        }, delay);
    }, [fn, delay]);
};

const MainPage = () => {
    const [appState, setAppState] = useState(initialState);
    const konvaWrapperRef = useRef<KonvaWrapper>();
    const helpTextWasShownOnce = useRef(false);

    const [isCreatingImg, setIsCreatingImg] = useState(false);

    const [showingHelpText, setShouldShowHelpText] = useState({
        part1: false,
        part2: false,
        part3: false,
    });

    const showHelpText = useCallback(() => {
        if (helpTextWasShownOnce.current) {
            setShouldShowHelpText(() => ({
                part1: true,
                part2: true,
                part3: true,
            }));
            return [];
        }
        helpTextWasShownOnce.current = true;
        setShouldShowHelpText(state => ({
            ...state,
            part1: true,
        }));
        const timeoutRef1 = setTimeout(() => {
            setShouldShowHelpText(state => ({
                ...state,
                part2: true,
            }));
        }, 2000);
        const timeoutRef2 = setTimeout(() => {
            setShouldShowHelpText(state => ({
                ...state,
                part3: true,
            }));
        }, 4000);
        return [timeoutRef1, timeoutRef2];
    }, []);

    const showHelpTextDebounced = useDebounce(showHelpText, 1000);

    const handleLogoHover = useCallback(() => {
        if (!appState.isMenuWidgetVisible)
            setAppState(state => {
                return {
                    ...state,
                    isDragging: false,
                    isMenuWidgetVisible: false,
                    canvasState: getDefaultCanvasState(),
                };
            });
    }, [appState.isMenuWidgetVisible]);

    useEffect(() => {
        showHelpTextDebounced();
        const wrapper = new KonvaWrapper(CANVAS_ID, window.innerWidth, window.innerHeight);
        konvaWrapperRef.current = wrapper;
        wrapper.on('mousedown', ({ evt }) => {
            showHelpTextDebounced();
            setShouldShowHelpText({
                part1: false,
                part2: false,
                part3: false,
            });
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
                          menuX: limitMenuWidgetXPos(evt.layerX - MOUSE_UP_PLACEMENT_X),
                          menuY: limitMenuWidgetYPos(evt.layerY - MOUSE_UP_PLACEMENT_Y),
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
                        text: imageText(toUIVal(newWidth), toUIVal(newHeight)),
                    },
                };
            });
        });

        // we want to hide all the items on the canvas if the user's mouse leaves the window.
        const handleMouseLeave = () => {
            setAppState(state => {
                return {
                    ...state,
                    isDragging: false,
                    isMenuWidgetVisible: false,
                    canvasState: getDefaultCanvasState(),
                };
            });
        };
        document.addEventListener('mouseleave', handleMouseLeave);

        // update the canvas size if the window size changes
        const handleResize = () => {
            setAppState(state => {
                return {
                    ...state,
                    isDragging: false,
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

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            konvaWrapperRef.current?.destroy();
        };
    }, [showHelpTextDebounced]);

    useEffect(() => {
        konvaWrapperRef.current?.render(appState.canvasState);
    }, [appState.canvasState]);

    const handleHeightInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const height = toInternalVal(+e.target.value);
        setAppState(state => ({
            ...state,
            canvasState: {
                ...state.canvasState,
                text: imageText(toUIVal(state.canvasState.width), toUIVal(height)),
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
                text: imageText(toUIVal(width), toUIVal(state.canvasState.height)),
                width,
            },
        }));
    }, []);

    const handleSelectFormat = useCallback((format: ImageFormat) => {
        setAppState(state => ({
            ...state,
            selectedFormat: format,
        }));
    }, []);

    const handleSave = useCallback(() => {
        setIsCreatingImg(true);
        saveAsImage(
            toUIVal(appState.canvasState.width),
            toUIVal(appState.canvasState.height),
            appState.selectedFormat,
            () => setIsCreatingImg(false),
        );
    }, [appState]);

    return (
        <>
            {!appState.isDragging && !appState.isMenuWidgetVisible && (
                <div className="absolute top-0 left-0 w-screen flex justify-center p-10 font-normal text-2xl text-gray-300">
                    <div className="w-6/12">
                        {showingHelpText.part1 && (
                            <span className="animate-fadeIn">Press thy enchanted mouse </span>
                        )}
                        {showingHelpText.part2 && (
                            <span className="animate-fadeIn">
                                and glide to summon an image of any size, grand or wee!
                            </span>
                        )}
                        {showingHelpText.part3 && (
                            <p className="animate-fadeIn mt-2 text-accent"> - Image Elf</p>
                        )}
                    </div>
                </div>
            )}
            {appState.isMenuWidgetVisible && (
                <article
                    className="absolute z-10 max-w-64 bg-white bg-opacity-90 rounded-lg shadow-lg p-6"
                    style={{ left: `${appState.menuX}px`, top: `${appState.menuY}px` }}
                >
                    <ImageEditor
                        onHeightChange={handleHeightInput}
                        onWidthChange={handleWidthInput}
                        onSelectFormat={handleSelectFormat}
                        onSave={handleSave}
                        state={{
                            selectedFormat: appState.selectedFormat,
                            width: toUIVal(appState.canvasState.width),
                            height: toUIVal(appState.canvasState.height),
                            creating: isCreatingImg,
                        }}
                    />
                </article>
            )}
            <div className="absolute z-[9] bottom-0 left-0 m-4" onMouseMove={handleLogoHover}>
                <a
                    className="w-full text-slate-800 hover:text-slate-600 duration-150"
                    target="_blank"
                    href="https://github.com/petukhov/image-elf"
                >
                    <GithubLogo width={25} height={25} />
                </a>
            </div>
            <div className="bg-gray-50" id={CANVAS_ID}></div>
        </>
    );
};

export default MainPage;
