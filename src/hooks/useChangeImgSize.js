import {useCallback, useEffect, useState} from "react";

export const useChangeImgSize = (mainScrollContainerRef) => {
    const [scale, setScale] = useState(100);
    const [fitMode, setFitMode] = useState('height');
    const [mainWindowHeight, setMainWindowHeight] = useState(0);
    const [mainWindowWidth, setMainWindowWidth] = useState(0);
    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'};


    const toggleFitMode = useCallback(() => {
        setFitMode(prevMode => {
            if (prevMode === FIT_MODE.HEIGHT) {
                return FIT_MODE.WIDTH;
            }
            if (prevMode === FIT_MODE.WIDTH) {
                return FIT_MODE.HEIGHT;
            }
        });

    }, []);

    const handleScaleChange = useCallback((newScale) => {
        setScale(newScale);
    }, []);

    /**
     * Обновление размера картинок в основном окне по кнопке "По размеру страницы"
     */
    useEffect(() => {
        if (mainScrollContainerRef.current) {
            const updateSize = () => {
                setMainWindowHeight(mainScrollContainerRef.current.clientHeight);
                setMainWindowWidth(mainScrollContainerRef.current.clientWidth);
            };
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, []);


    return {
        toggleFitMode,
        handleScaleChange,
        scale,
        setScale,
        fitMode,
        setFitMode,
        mainWindowHeight,
        setMainWindowHeight,
        mainWindowWidth,
        setMainWindowWidth
    }
}