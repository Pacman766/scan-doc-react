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
                                         showSidebar,
                                         setScale,
                                         scale,
                                         imageRefs
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
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '60px',
                paddingBottom: '20px',
                transform: showSidebar ? 'translateX(125px)' : 'translateX(0px)',
                transition: 'transform 0.3s ease-in-out'
            }}
            className="main-window-scroll-container"
        >
            <ScannedPages
                files={files}
                activePage={activePage}
                onPageClick={scrollToPage}
                highlight={false}
                type="main"
                rotationMap={rotationMap}
                mainWindowWidth={mainWindowWidth}
                mainWindowHeight={mainWindowHeight}
                fitMode={fitMode}
                setScale={setScale}
                scale={scale}
                imageRefs={imageRefs}
            />
        </div>
    );
});

export default MainWindow;