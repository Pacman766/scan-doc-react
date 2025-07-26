import React, {useCallback, useEffect, useRef, useState} from 'react';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import MainWindow from "./MainWindow";
import {useIntersectionObserver} from "../hooks/useIntersection";
import {useChangeImgSize} from "../hooks/useChangeImgSize";
import {AiOutlineColumnWidth} from "react-icons/ai";
import {useConfig} from "../hooks/useConfig";
import {useScanFiles} from "../hooks/useScanFiles"


const ScanPanel = () => {
    const data = [
        {number: 1, type: 'jpg', content: 'jpg/api_page-0001.jpg'},
        {number: 2, type: 'jpg', content: 'jpg/api_page-0002.jpg'},
        {number: 3, type: 'jpg', content: 'jpg/api_page-0003.jpg'},
        {number: 4, type: 'jpg', content: 'jpg/api_page-0004.jpg'}
    ];

    const [files, setFiles] = useState([]);
    const [showSidebar, setShowSidebar] = useState(true);
    const [rotationMap, setRotationMap] = useState({});
    const [loading, setLoading] = useState(false);

    const mainScrollContainerRef = useRef(null);
    const localImageRefs = useRef({});

    const FIT_MODE = {WIDTH: 'width', HEIGHT: 'height'};

    const {activePage, setActivePage, setObservedElementRef} = useIntersectionObserver(
        mainScrollContainerRef,
        1 // Initial active page
    );
    const {
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
    } = useChangeImgSize(mainScrollContainerRef);

    const {config, getScanners, getConfig, scanners, saveConfig} = useConfig();

    const scrollToPage = useCallback((pageNumber) => {
        const targetElement = localImageRefs.current[pageNumber];
        if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, []);

    const {scan, handleDeletePage} = useScanFiles(files, setFiles, setLoading, activePage, setActivePage, scrollToPage);

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

    const setMainImageRef = useCallback((pageNumber, el) => {
        setObservedElementRef(pageNumber, el);

        if (el) {
            localImageRefs.current[pageNumber] = el;
        } else {
            delete localImageRefs.current[pageNumber];
        }
    }, [setObservedElementRef]);

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
                activePage={activePage}
                scrollToPage={scrollToPage}
                handleDeletePage={handleDeletePage}
                handleRotatePage={handleRotatePage}
                scale={scale}
                setScale={handleScaleChange}
                handleFitMode={toggleFitMode}
                fitMode={fitMode}
                scanners={scanners}
                config={config}
                getScanners={getScanners}
                saveConfig={saveConfig}

            />
            <Sidebar
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
                files={files}
                activePage={activePage}
                scrollToPage={scrollToPage}
                rotationMap={rotationMap}
            />
            <MainWindow
                files={files}
                activePage={activePage}
                scrollToPage={scrollToPage}
                setMainImageRef={setMainImageRef}
                ref={mainScrollContainerRef}
                rotationMap={rotationMap}
                fitMode={fitMode}
                mainWindowHeight={mainWindowHeight}
                mainWindowWidth={mainWindowWidth}
                setScale={setScale}
                scale={scale}
                showSidebar={showSidebar}
            />
        </div>
    );
};

export default ScanPanel;