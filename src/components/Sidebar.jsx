// src/Sidebar.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Offcanvas } from "react-bootstrap";
import ScannedPages from "./ScannedPages";

const Sidebar = ({
                     showSidebar,
                     toggleSidebar,
                     files,
                     activePage,
                     scrollToPage,
                     rotationMap
                 }) => {
    // Create a ref object to store individual sidebar item DOM nodes
    const sidebarItemRefs = useRef({});

    // Callback to set the ref for each sidebar item
    const setSidebarItemRef = useCallback((pageNumber, el) => {
        if (el) {
            sidebarItemRefs.current[pageNumber] = el;
        } else {
            delete sidebarItemRefs.current[pageNumber]; // Clean up on unmount
        }
    }, []);

    // Effect to scroll the active sidebar item into view
    useEffect(() => {
        const ref = sidebarItemRefs.current[activePage];
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [activePage]); // Rerun when activePage changes

    return (
        <>
            <Offcanvas
                show={showSidebar}
                onHide={toggleSidebar}
                placement="start"
                data-bs-theme="dark"
                className="z-1"
                style={{ width: 300 }}
                backdrop={false}
                scroll={true}
            >
                <Offcanvas.Header bg="dark" data-bs-theme="dark">
                </Offcanvas.Header>
                <Offcanvas.Body data-bs-theme="dark">
                    <div className="d-flex flex-column align-items-center gap-3"
                         style={{ overflowY: 'auto', marginTop: '30px' }}>
                        <ScannedPages
                            files={files}
                            imgWidth="90%"
                            activePage={activePage} // Pass activePage
                            onPageClick={scrollToPage} // Click on sidebar item also scrolls main view
                            highlightActive={true} // Always highlight in sidebar
                            setPageRef={setSidebarItemRef} // Pass the ref setter for sidebar items
                            type="sidebar" // Indicate it's the sidebar
                            rotationMap={rotationMap}
                        />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;