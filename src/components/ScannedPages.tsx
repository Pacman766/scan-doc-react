import React from 'react';
import ScannedPage from "./ScannedPage";
import {useScanContext} from "../context/ScanContext";
import type {ScannedPagesProps} from "../types/scannedPages"

const ScannedPages = ({
                          onPageClick,
                          highlightActive,
                          type
                      }: ScannedPagesProps) => {
    const {
        files,
        activePage,
        imageRefs,
    } = useScanContext();

    const scrollableContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const pagesWrapperStyle: React.CSSProperties = {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '1rem',
    };

    return (
        <div style={scrollableContainerStyle}>
            <div style={pagesWrapperStyle}>
                {files.map((file, index) => (
                    <ScannedPage
                        key={file.number}
                        file={file}
                        index={index}
                        onClick={() => onPageClick?.(file.number)}
                        highlight={highlightActive && activePage === file.number}
                        type={type}
                        ref={(el) => {
                            if (imageRefs?.current) {
                                imageRefs.current[index] = el;
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScannedPages;