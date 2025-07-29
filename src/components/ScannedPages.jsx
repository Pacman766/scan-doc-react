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
                          setScale,
                          scale,
                          imageRefs
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
                    onClick={() => onPageClick?.(file.number)}
                    highlight={highlightActive && activePage === file.number}
                    type={type}
                    rotationMap={rotationMap}
                    mainWindowHeight={mainWindowHeight}
                    mainWindowWidth={mainWindowWidth}
                    fitMode={fitMode}
                    setScale={setScale}
                    scale={scale}
                    ref={(el) => {
                        if (imageRefs?.current) {
                            imageRefs.current[index] = el;
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default ScannedPages;