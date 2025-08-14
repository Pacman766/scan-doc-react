import {useCallback, useContext, useEffect, useState} from "react";
import {useScanContext} from "../context/ScanContext";
import {RootState, store} from "../store";
import {setScale} from "../store/slices/scaleSlice";
import {useSelector} from "react-redux";

export const useChangeImgSize = () => {
    const {
        scrollContainerRef,
        setFitMode,
        setMainWindowHeight,
        setMainWindowWidth,
        setZooming,
    } = useScanContext();
    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'} as const;
    const currentScale = useSelector((state: RootState) => state.scale);
    const markZooming = useCallback(() => {
        setZooming(true);
        setTimeout(() => setZooming(false), 200);
    }, [setZooming]);

    const toggleFitMode = useCallback(() => {
        setFitMode(prevMode  => {
            if (prevMode === FIT_MODE.HEIGHT) {
                store.dispatch(setScale(40));
                return FIT_MODE.WIDTH;
            }

            store.dispatch(setScale(100));
            return FIT_MODE.HEIGHT;
        });
        markZooming();

    }, []);

    const handleScaleChange = useCallback((newScale: number) => {
        store.dispatch(setScale(newScale));
        markZooming();
    }, [markZooming]);

    /**
     * Обновление размера картинок в основном окне по кнопке "По размеру страницы"
     */
    useEffect(() => {
        const updateSize = () => {
            if (scrollContainerRef.current) {
                setMainWindowHeight(scrollContainerRef.current?.clientHeight);
                setMainWindowWidth(scrollContainerRef.current?.clientWidth);
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);

    }, [scrollContainerRef]);

    const incScale = () => {
        const newScale = Math.min(400, currentScale + 10);
        store.dispatch(setScale(newScale));
        markZooming();
    }

    const decScale = () => {
        const newScale = Math.min(400, currentScale - 10);
        store.dispatch(setScale(newScale));
        markZooming();
    }


    return {
        toggleFitMode,
        handleScaleChange,
        incScale,
        decScale
    }
}