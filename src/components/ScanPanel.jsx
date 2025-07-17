import React, {useCallback, useRef, useState} from 'react';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import MainWindow from "./MainWindow";
import {useIntersectionObserver} from "../hooks/useIntersection";
import {useChangeImgSize} from "../hooks/useChangeImgSize";


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
    } = useChangeImgSize(mainScrollContainerRef)

    const scrollToPage = useCallback((pageNumber) => {
        const targetElement = localImageRefs.current[pageNumber];
        if (targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, []);

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

    const handleDeletePage = useCallback(() => {
        if (activePage < 1 || activePage > files.length) {
            console.warn("Cannot delete: activePage is out of bounds.");
            return;
        }

        let newArr = files.filter((_, i) => {
            return i !== activePage - 1
        });
        newArr.forEach((file, i) => {
            file.number = i + 1;
        });
        setFiles(newArr);

        if (newArr.length === 0) {
            setActivePage(1);
        } else if (activePage > newArr.length) {
            scrollToPage(newArr.length);
        } else {
            scrollToPage(activePage);
        }
    }, [activePage, files, scrollToPage]);

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