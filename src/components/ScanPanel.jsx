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


const ScanPanel = () => {
    const data = [
        {number: 1, type: 'jpg', content: 'jpg/api_page-0001.jpg'},
        {number: 2, type: 'jpg', content: 'jpg/api_page-0002.jpg'},
        {number: 3, type: 'jpg', content: 'jpg/api_page-0003.jpg'},
        {number: 4, type: 'jpg', content: 'jpg/api_page-0004.jpg'}
    ];

    const {
        activePage,
        setActivePage,
        files,
        setFiles,
        scrollContainerRef,
        isZooming,
        setZooming,
        rotationMap,
        setRotationMap,
        imageRefs,
        fitMode,
        setFitMode,
        scale,
        setScale,
        mainWindowHeight,
        mainWindowWidth,
        mainScrollContainerRef
    } =  useScanContext();

    const [showSidebar, setShowSidebar] = useState(true);
    const [loading, setLoading] = useState(false);
    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'};

    const {scrollToPage} = useIntersectionObserver();
    const {toggleFitMode, handleScaleChange, incScale, decScale} = useChangeImgSize();
    const {config, getScanners, getConfig, scanners, saveConfig} = useConfig();
    const {scan, handleDeletePage} = useScanFiles( setLoading, scrollToPage);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleScan = () => {
        setFiles(data);
        setActivePage(1);
        if (mainScrollContainerRef.current) {
            mainScrollContainerRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }

        setFitMode(FIT_MODE.HEIGHT);
        setScale(100);
    };

    const handleRotatePage = (index) => {
        const newDegree = (rotationMap[index] || 0) + 90;

        setRotationMap(prev => ({
            ...prev,
            [index]: newDegree
        }));
        setFiles(prevFiles =>
            prevFiles.map((file, i) =>
                i === index ? {...file, degree: newDegree} : file
            )
        );
    };

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div className="dark-mode">
            <Navigation
                toggleSidebar={toggleSidebar}
                onScan={handleScan}
                totalPages={files?.length}
                scrollToPage={scrollToPage}
                handleDeletePage={handleDeletePage}
                handleRotatePage={handleRotatePage}
                handleScaleChange={handleScaleChange}
                handleFitMode={toggleFitMode}
                scanners={scanners}
                config={config}
                getScanners={getScanners}
                saveConfig={saveConfig}
                incScale={incScale}
                decScale={decScale}
            />
            <Sidebar
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
                files={files}
                activePage={activePage}
                scrollToPage={scrollToPage}
            />
            <MainWindow
                scrollToPage={scrollToPage}
                showSidebar={showSidebar}
            />
        </div>
    );
};

export default ScanPanel;