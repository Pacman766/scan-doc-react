import React, {useCallback, useEffect, useRef, useState} from 'react';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import MainWindow from "./MainWindow";
import {useIntersectionObserver} from "../hooks/useIntersectionObserver";
import {useChangeImgSize} from "../hooks/useChangeImgSize";
import {AiOutlineColumnWidth} from "react-icons/ai";
import {useConfig} from "../hooks/useConfig";
import {useScanFiles} from "../hooks/useScanFiles"
import {useScanContext} from "../context/ScanContext";
import {data} from "../utils/Files";
import {store, useAppStore} from "../store";
import {setScale} from "../store/slices/scaleSlice";
import { setAllFiles } from '../store/slices/filesSlice';

const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'} as const;

const ScanPanel: React.FC = () => {
    const {
        activePage,
        setActivePage,
        rotationMap,
        setRotationMap,
        setFitMode,
        mainScrollContainerRef
    } =  useScanContext();

    const [showSidebar, setShowSidebar] = useState(true);
    const [loading, setLoading] = useState(false);

    const {scrollToPage} = useIntersectionObserver();
    const {toggleFitMode, handleScaleChange, incScale, decScale} = useChangeImgSize();
    const {getScanners, saveConfig} = useConfig();
    const {scan, handleDeletePage} = useScanFiles(scrollToPage);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleScan = () => {
        store.dispatch(setAllFiles(data));
        console.log('files data: ', data)
        // setFiles(data);
        setActivePage(1);
        if (mainScrollContainerRef.current) {
            mainScrollContainerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }

        setFitMode(FIT_MODE.HEIGHT);
        store.dispatch(setScale(100));
    };

    const handleRotatePage = (index: number) => {
        const newDegree = (rotationMap[index] || 0) + 90;

        setRotationMap(prev => ({
            ...prev,
            [index]: newDegree
        }));
        // setFiles(prevFiles =>
        //     prevFiles.map((file, i) =>
        //         i === index ? {...file, degree: newDegree} : file
        //     )
        // );
    };

    return (
        <div className="dark-mode">
            <Navigation
                toggleSidebar={toggleSidebar}
                onScan={handleScan}
                handleDeletePage={handleDeletePage}
                handleRotatePage={handleRotatePage}
                handleScaleChange={handleScaleChange}
                handleFitMode={toggleFitMode}
                getScanners={getScanners}
                saveConfig={saveConfig}
                incScale={incScale}
                decScale={decScale} scanners={[]}/>
            <Sidebar
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
                scrollToPage={scrollToPage}
            />
            <MainWindow
                scrollToPage={scrollToPage}
                showSidebar={showSidebar}
                ref={mainScrollContainerRef as React.RefObject<HTMLDivElement>}
            />
        </div>
    );
};

export default ScanPanel;