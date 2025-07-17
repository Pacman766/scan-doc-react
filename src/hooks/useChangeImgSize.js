import {useCallback, useState} from "react";

export const useChangeImgSize = () => {
    const [scale, setScale] = useState(100);
    const [fitMode, setFitMode] = useState('height');
    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'};


    const toggleFitMode = useCallback(() => {
        setFitMode(prevMode => {
            if (prevMode === FIT_MODE.HEIGHT){
                return FIT_MODE.WIDTH;
            }
            if (prevMode === FIT_MODE.WIDTH){
                return FIT_MODE.HEIGHT;
            }
        });

    }, []);

    const handleScaleChange = useCallback((newScale) => {
        setScale(newScale);
    }, []);


    return {toggleFitMode, handleScaleChange, scale, setScale, fitMode, setFitMode}
}