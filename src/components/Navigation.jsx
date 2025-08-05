import React, { useRef, useState, useEffect } from 'react';
import { Container, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
// Assuming you have these custom components
import ButtonOutline from './buttonOutline/ButtonOutline';
import ButtonDefault from './buttonDefault/ButtonDefault';
import VerticalSeparator from './VerticalSeparator';
import SettingsDialog from './SettingsDialog';

// Import icons
import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';
import { HiMinus } from 'react-icons/hi';
import { BsPlusLg } from 'react-icons/bs';
import { MdOutlineRotate90DegreesCcw } from 'react-icons/md';
import { CiPlay1 } from 'react-icons/ci';
import { IoSaveOutline, IoSettingsOutline } from 'react-icons/io5';
import {AiOutlineColumnWidth, AiOutlineColumnHeight} from "react-icons/ai";
import {useScanContext} from "../context/ScanContext";

const Navigation = ({
                        toggleSidebar,
                        onScan,
                        totalPages,
                        scrollToPage,
                        handleDeletePage,
                        handleRotatePage,
                        handleFitMode,
                        config,
                        getScanners,
                        scanners,
                        saveConfig,
                        incScale,
                        decScale,
                        handleScaleChange
                    }) => {
    const {activePage, scale, fitMode} = useScanContext();

    const [pageInputValue, setPageInputValue] = useState(String(activePage));
    const [showTooltip, setShowTooltip] = useState(false);
    const pageInputRef = useRef(null);

    useEffect(() => {
        setPageInputValue(String(activePage));
    }, [activePage]);

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setPageInputValue(value);
            setShowTooltip(false);
        }
    };

    // const handlePageInputBlur = () => {
    //     let pageNum = parseInt(pageInputValue, 10);
    //     if (isNaN(pageNum) || pageNum < 1) {
    //         pageNum = 1;
    //     }
    //     if (pageNum > totalPages) {
    //         pageNum = totalPages;
    //     }
    //     setPageInputValue(String(pageNum));
    //     if (pageNum !== activePage) {
    //         scrollToPage(pageNum);
    //     }
    //     setShowTooltip(false);
    // };

    const handlePageInputFocus = () => {
        if (totalPages === 0) return;
        setShowTooltip(true);
    };

    const renderPageTooltip = (props) => (
        <Tooltip id="page-input-tooltip" {...props}>
            Enter page number
        </Tooltip>
    );

    const getFitModeIcon = () => {
        if (fitMode === 'height') return <AiOutlineColumnWidth color="#AFB2B6" />;
        if (fitMode === 'width') return <AiOutlineColumnHeight color="#AFB2B6" />;
    };
    //
    // const getFitModeTooltip = () => {
    //     if (fitMode === 'height') return "Fit to Height";
    //     if (fitMode === 'width') return "Fit to Width";
    //     return "Manual Zoom"; // Tooltip for 'manual' or default
    // };

    return (
        <Navbar
            bg="dark"
            data-bs-theme="dark"
            style={{ zIndex: 10, boxShadow: "-8px 8px 5px -2px rgba(126, 126, 126, 0.2)" }}
            sticky="top"
        >
            <Container fluid className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                    <ButtonOutline onClick={toggleSidebar} isDisabled={totalPages === 0}
                                   icon={<RxHamburgerMenu color="#AFB2B6" />} />
                </div>

                <div className="d-flex align-items-center justify-content-center flex-grow-1">

                    <div className="d-flex align-items-center justify-content-center">
                        <OverlayTrigger
                            placement="bottom"
                            overlay={renderPageTooltip}
                            show={showTooltip}
                            container={pageInputRef.current?.offsetParent || document.body}
                        >
                            <input
                                ref={pageInputRef}
                                disabled={totalPages === 0}
                                type="text"
                                value={pageInputValue}
                                onChange={handlePageInputChange}
                                // onBlur={handlePageInputBlur}
                                onFocus={handlePageInputFocus}
                                style={{
                                    width: '35px',
                                    height: '30px',
                                    backgroundColor: '#1e1e1e',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    padding: '2px 5px',
                                    outline: 'none',
                                }}
                            />
                        </OverlayTrigger>
                        <span className="mx-2 text-muted">/</span>
                        <span className="text-muted" style={{ minWidth: '25px', textAlign: 'center' }}>
                                {totalPages || 1}
                            </span>

                    </div>

                    <VerticalSeparator />
                    <div className="d-flex align-items-center">
                        <ButtonOutline
                            isDisabled={totalPages === 0}
                            icon={<HiMinus color="#AFB2B6" />}
                            onClick={decScale}
                        />
                        <input
                            disabled={totalPages === 0}
                            type="text"
                            value={scale + '%'}
                            onChange={(e) => handleScaleChange(e.target.value.replace(/\D/, ''))}
                            style={{
                                width: '45px',
                                height: '30px',
                                backgroundColor: '#1e1e1e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                textAlign: 'center',
                                fontSize: '14px',
                                padding: '2px 5px',
                                outline: 'none',
                            }}
                        />
                        <ButtonOutline
                            icon={<BsPlusLg color="#AFB2B6" />}
                            isDisabled={totalPages === 0}
                            onClick={incScale} // Max scale 400%
                        />
                    </div>

                    <VerticalSeparator />
                    <ButtonOutline
                        icon={getFitModeIcon()}
                        isDisabled={totalPages === 0}
                        onClick={handleFitMode}
                    />
                    <ButtonOutline icon={<MdOutlineRotate90DegreesCcw color="#AFB2B6" />}
                                   isDisabled={totalPages === 0}
                                   onClick={() =>handleRotatePage(activePage-1)}
                    />
                    <ButtonOutline icon={<RxCross1 color="red" />} isDisabled={totalPages === 0} onClick={handleDeletePage} />
                </div>

                <div className="d-flex align-items-center">
                    <ButtonDefault
                        icon={<CiPlay1 color="#AFB2B6" />}
                        text={"Сканировать"}
                        onClick={onScan}
                    />
                    <ButtonDefault
                        icon={<IoSaveOutline color="#AFB2B6" />}
                        text={"Сохранить"}
                        isDisabled={totalPages === 0}
                    />
                </div>
            </Container>
            <SettingsDialog
                config={config}
                getScanners={getScanners}
                scanners={scanners}
                saveConfig={saveConfig}
            />
        </Navbar>
    );
};

export default Navigation;