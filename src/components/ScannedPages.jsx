// src/ScannedPages.jsx
import React from 'react';
import ScannedPage from "./ScannedPage";

const ScannedPages = ({
                          files,
                          activePage,
                          onPageClick,
                          highlightActive,
                          setPageRef,
                          type,
                          rotationMap,
                          mainWindowHeight,
                          mainWindowWidth,
                          fitMode,
                          scale // Receive scale here
                      }) => {
    return (
        <div style={{
            flex: 1,
            marginTop: type === 'sidebar' ? '0' : '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {files.map((file, index) => (
                <ScannedPage
                    key={file.number}
                    file={file}
                    index={index}
                    ref={(el) => setPageRef(file.number, el)}
                    onClick={() => onPageClick?.(file.number)}
                    highlight={highlightActive && activePage === file.number}
                    type={type}
                    rotationMap={rotationMap}
                    mainWindowHeight={mainWindowHeight}
                    mainWindowWidth={mainWindowWidth}
                    fitMode={fitMode}
                    scale={scale} // Pass scale to individual page
                />
            ))}
        </div>
    );
};

export default ScannedPages;