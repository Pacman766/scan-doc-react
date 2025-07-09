// src/MainWindow.jsx
import React from 'react';
import ScannedPages from "./ScannedPages";

const MainWindow = React.forwardRef(({
                                         files,
                                         activePage,
                                         scrollToPage,
                                         setMainImageRef,
                                         rotationMap,
                                         mainWindowWidth,
                                         mainWindowHeight,
                                         fitMode,
                                         scale,
                                         showSidebar
                                     }, mainScrollContainerRef) => {
    return (
        <div
            ref={mainScrollContainerRef}
            style={{
                flexGrow: 1,
                overflowY: 'scroll',
                height: '100vh',
                scrollBehavior: 'smooth',
                scrollSnapType: 'y proximity',
                display: 'flex',
                flexDirection: 'column', // Allow vertical stacking of pages
                alignItems: 'center', // Center pages horizontally
                paddingTop: '60px', // Offset for fixed Navbar
                paddingBottom: '20px', // Some bottom padding
                transform: showSidebar ? 'translateX(125px)' : 'translateX(0px)',
                transition: 'transform 0.3s ease-in-out'
            }}
            className="main-window-scroll-container"
        >
            <ScannedPages
                files={files}
                activePage={activePage}
                onPageClick={scrollToPage}
                setPageRef={setMainImageRef}
                type="main"
                rotationMap={rotationMap}
                mainWindowWidth={mainWindowWidth}
                mainWindowHeight={mainWindowHeight}
                fitMode={fitMode}
                scale={scale} // Pass scale to ScannedPages
            />
        </div>
    );
});

export default MainWindow;