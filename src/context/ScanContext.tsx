import React, {createContext, ForwardedRef, useContext, useRef, useState} from "react";
import {Page} from "../types/scanFiles";

type RotationMap = Record<number, number>;

type ScanContextType = {
    mainScrollContainerRef: React.RefObject<HTMLDivElement | null>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    imageRefs: React.RefObject<(HTMLImageElement | null)[]>;
    activePage: number;
    setActivePage: React.Dispatch<React.SetStateAction<number>>;
    isZooming: boolean;
    setZooming: React.Dispatch<React.SetStateAction<boolean>>;
    // files: Page[];
    // setFiles: React.Dispatch<React.SetStateAction<Page[]>>;
    rotationMap: RotationMap;
    setRotationMap: React.Dispatch<React.SetStateAction<RotationMap>>;
    fitMode: 'width' | 'height';
    setFitMode: React.Dispatch<React.SetStateAction<'width' | 'height'>>;
    mainWindowHeight: number;
    setMainWindowHeight: React.Dispatch<React.SetStateAction<number>>;
    mainWindowWidth: number;
    setMainWindowWidth: React.Dispatch<React.SetStateAction<number>>;
};

const ScanContext = createContext<ScanContextType | null>(null);

export const ScanProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
    const mainScrollContainerRef = useRef<HTMLDivElement | null>(null);

    const [activePage, setActivePage] = useState<number>(1);
    const [isZooming, setZooming] = useState<boolean>(false);
    const [rotationMap, setRotationMap] = useState<RotationMap>({});
    const [fitMode, setFitMode] = useState<'height' | 'width'>('height');
    const [mainWindowHeight, setMainWindowHeight] = useState<number>(0);
    const [mainWindowWidth, setMainWindowWidth] = useState<number>(0);
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
                rotationMap,
                setRotationMap,
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