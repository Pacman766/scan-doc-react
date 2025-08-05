import {useCallback, useContext, useEffect, useState} from "react";
import {useScanContext} from "../context/ScanContext";

export const useChangeImgSize = () => {
    const {
        scrollContainerRef,
        scale,
        setScale,
        fitMode,
        setFitMode,
        mainWindowHeight,
        setMainWindowHeight,
        mainWindowWidth,
        setMainWindowWidth,
        setZooming,
        mainScrollContainerRef
    } = useScanContext();
    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'};

    const markZooming = useCallback(() => {
        setZooming(true);
        setTimeout(() => setZooming(false), 200);
    }, [setZooming]);

    const toggleFitMode = useCallback(() => {
        setFitMode(prevMode => {
            if (prevMode === FIT_MODE.HEIGHT) {
                setScale(40);
                return FIT_MODE.WIDTH;
            }
            if (prevMode === FIT_MODE.WIDTH) {
                setScale(100);
                return FIT_MODE.HEIGHT;
            }
        });
        markZooming();

    }, []);

    const handleScaleChange = useCallback((newScale) => {
        setScale(newScale);
        markZooming();
    }, [markZooming]);

    /**
     * Обновление размера картинок в основном окне по кнопке "По размеру страницы"
     */
    useEffect(() => {
        if (scrollContainerRef.current) {
            const updateSize = () => {
                setMainWindowHeight(scrollContainerRef.current.clientHeight);
                setMainWindowWidth(scrollContainerRef.current.clientWidth);
            };
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [scrollContainerRef]);

    const incScale = () => {
        setScale(prev => Math.min(400, prev + 10));
        markZooming();
    }

    const decScale = () => {
        setScale(prev => Math.max(10, prev - 10));
        markZooming();
    }


    return {
        toggleFitMode,
        handleScaleChange,
        incScale,
        decScale
    }
}