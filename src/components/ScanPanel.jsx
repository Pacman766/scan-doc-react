import React, { useRef, useState, useEffect, useCallback } from 'react';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import MainWindow from "./MainWindow";

const ScanPanel = () => {
    const data = [
        { number: 1, type: 'jpg', content: 'jpg/api_page-0001.jpg' },
        { number: 2, type: 'jpg', content: 'jpg/api_page-0002.jpg' },
        { number: 3, type: 'jpg', content: 'jpg/api_page-0003.jpg' },
        { number: 4, type: 'jpg', content: 'jpg/api_page-0004.jpg' }
    ];

    const [files, setFiles] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [showSidebar, setShowSidebar] = useState(true);
    const mainImageRefs = useRef({});
    const mainScrollContainerRef = useRef(null);
    const [rotationMap, setRotationMap] = useState({});
    const [scale, setScale] = useState(100);
    const [fitMode, setFitMode] = useState('height');
    const [mainWindowHeight, setMainWindowHeight] = useState(0);
    const [mainWindowWidth, setMainWindowWidth] = useState(0);


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

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleScan = () => {
        setFiles(data);
        setActivePage(1);
        if (mainScrollContainerRef.current) {
            mainScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setFitMode('height');
        setScale(100);
    };

    const setMainImageRef = useCallback((pageNumber, el) => {
        if (el) {
            mainImageRefs.current[pageNumber] = el;
        } else {
            delete mainImageRefs.current[pageNumber];
        }
    }, []);

    const scrollToPage = useCallback((pageNumber) => {
        const targetElement = mainImageRefs.current[pageNumber];
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const handleIntersection = useCallback((entries) => {
        const intersectingEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
                const aRatio = a.intersectionRatio;
                const bRatio = b.intersectionRatio;
                if (aRatio === 1 && bRatio < 1) return -1;
                if (bRatio === 1 && aRatio < 1) return 1;
                return bRatio - aRatio;
            });

        if (intersectingEntries.length > 0) {
            const mostVisiblePageId = intersectingEntries[0].target.dataset.page;
            const pageNum = parseInt(mostVisiblePageId, 10);
            if (pageNum !== activePage) {
                setActivePage(pageNum);
            }
        }
    }, [activePage]);

    useEffect(() => {
        if (!mainScrollContainerRef.current) return;
        if (mainImageRefs && mainImageRefs.current && Object.keys(mainImageRefs.current).length > 0){
           const observer = new IntersectionObserver(handleIntersection, {
                root: mainScrollContainerRef.current,
                rootMargin: '0px',
                threshold: [0.1, 0.5, 0.9]
            });

            Object.values(mainImageRefs.current).forEach(node => {
                if (node) observer.observe(node);
            });

            if (observer && observer.current){
                return () => {
                    observer.disconnect();
                };
            }
        }

    }, [files, activePage]);

    const handleDeletePage = useCallback(()  => {
        if (activePage < 1 || activePage > files.length){
            console.warn("Cannot delete: activePage is out of bounds.");
            return;
        }

        let newArr = files.filter((_,i) => {
            return  i !== activePage-1
        });
        newArr.forEach((file,i) => {
            file.number = i+1;
        });
        setFiles(newArr);

        if (newArr.length === 0){
            setActivePage(1);
        } else if (activePage > newArr.length){
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
                i === index ? { ...file, degree: newDegree } : file
            )
        );
    };

    const toggleFitMode = useCallback(() => {
        setFitMode(prevMode => {
            if (prevMode === 'height') return 'width';
            if (prevMode === 'width') return 'height';
        });
    }, []);

    const handleScaleChange = useCallback((newScale) => {
        setScale(newScale);
        setFitMode('manual');
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
                scale={scale}
                showSidebar={showSidebar}
            />
        </div>
    );
};

export default ScanPanel;