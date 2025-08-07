import React, {ForwardedRef} from 'react';
import ScannedPages from "./ScannedPages";
import {useScanContext} from "../context/ScanContext";

interface MainWindowProps {
    scrollToPage: (page: number) => void;
    showSidebar: boolean;
}

const MainWindow = React.forwardRef<HTMLDivElement, MainWindowProps>(({
                                         scrollToPage,
                                         showSidebar,
                                     }, mainScrollContainerRef: ForwardedRef<HTMLDivElement>) => {

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
                onPageClick={scrollToPage}
                highlightActive={false}
                type="main"
            />
        </div>
    );
});

export default MainWindow;