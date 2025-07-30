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
    const sidebarItemRefs = useRef({});

    // const setSidebarItemRef = useCallback((pageNumber, el) => {
    //     if (el) {
    //         sidebarItemRefs.current[pageNumber] = el;
    //     } else {
    //         delete sidebarItemRefs.current[pageNumber]; // Clean up on unmount
    //     }
    // }, []);

    useEffect(() => {
        const ref = sidebarItemRefs.current[activePage-1];
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [activePage]);

    return (
        <>
            <Offcanvas
                show={showSidebar}
                onHide={toggleSidebar}
                placement="start"
                data-bs-theme="dark"
                className="z-1"
                style={{ width: 250 }}
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
                            activePage={activePage}
                            onPageClick={scrollToPage}
                            highlightActive={true}
                            type="sidebar"
                            rotationMap={rotationMap}
                        />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;