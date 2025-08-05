import {createContext, useCallback, useContext, useRef, useState} from "react";

const ScanContext = createContext(null);

export const ScanProvider = ({children}) => {
    const scrollContainerRef = useRef(null);
    const imageRefs = useRef([]);
    const [activePage, setActivePage] = useState(1);
    const [isZooming, setZooming] = useState(false);
    const [files, setFiles] = useState([]);
    const [rotationMap, setRotationMap] = useState({});
    const [scale, setScale] = useState(100);
    const [fitMode, setFitMode] = useState('height');
    const [mainWindowHeight, setMainWindowHeight] = useState(0);
    const [mainWindowWidth, setMainWindowWidth] = useState(0);
    const mainScrollContainerRef = useRef(null);
    return(
        <ScanContext.Provider
            value={{
                mainScrollContainerRef,
                scrollContainerRef,
                imageRefs,
                activePage,
                setActivePage,
                isZooming,
                setZooming,
                files,
                setFiles,
                rotationMap,
                setRotationMap,
                scale,
                setScale,
                fitMode,
                setFitMode,
                mainWindowHeight,
                setMainWindowHeight,
                mainWindowWidth,
                setMainWindowWidth
            }}
        >
            {children}
        </ScanContext.Provider>
    )
}

export const useScanContext = () => {
    const context = useContext(ScanContext);
    if(!context){
        throw new Error('useScanContext must be used within a ScanProvider');
    }
    return context;
}