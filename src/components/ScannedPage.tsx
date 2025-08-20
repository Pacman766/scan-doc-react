import React, {forwardRef} from 'react';
import {useScanContext} from "../context/ScanContext";
import type {ScannedPageProps} from "../types/scannedPage";
import {store} from "../store";


const ScannedPage = forwardRef(
    ({
         file,
         index,
         onClick,
         highlight,
         type,
     }: ScannedPageProps , ref:  React.Ref<HTMLImageElement>) => {

        const {
            rotationMap,
            fitMode,
            mainWindowHeight,
            mainWindowWidth,
        } = useScanContext();

        const handleClick = () => {
            if (onClick) {
                onClick(file.number);
            }
        };

        // const handleImageLoad = useCallback((naturalWidth, naturalHeight) => {
        //     if (type !== 'main') return;
        //
        //     const rotation = rotationMap?.[index] || 0;
        //     let newScale = 100;
        //
        //     if (fitMode === 'height') {
        //         const displayHeight = mainWindowHeight - 100;
        //         const baseHeight = rotation % 180 === 0 ? naturalHeight : naturalWidth;
        //         newScale = Math.round((displayHeight / baseHeight) * 100);
        //     } else if (fitMode === 'width') {
        //         const displayWidth = mainWindowWidth - 340;
        //         const baseWidth = rotation % 180 === 0 ? naturalWidth : naturalHeight;
        //         newScale = Math.round((displayWidth / baseWidth) * 100);
        //     }
        //     setScale(newScale);
        // }, [fitMode]);


        const wrapperStyle: React.CSSProperties = {
            transform: type === 'main' ? `scale(${store.getState().scale / 100})` : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center top', // ✅ avoid shifting
            width: '100%',
        };

        const imgStyle: React.CSSProperties = {
            maxWidth: '100%',
            maxHeight: '100%',
            transform: `rotate(${rotationMap?.[index] || 0}deg)`,
            width: type === 'sidebar' ? '120px' : 'auto',
            borderRadius: '6px',
            border: highlight ? '3px solid #0d6efd' : 'none',
            objectFit: 'contain',
            // transition: 'transform 0.3s ease, width 0.3s ease, height 0.3s ease',
        };

        const pageContainerStyle: React.CSSProperties = {
            marginBottom: '1rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            scrollMarginTop: '60px',
            cursor: 'pointer',
        };

        return (
            <div
                className="scanned-page-container"
                onClick={handleClick}
                style={pageContainerStyle}
                data-page={file.number}
            >
                <div className="img-wrapper" style={wrapperStyle}>
                    <img
                        src={file.content}
                        alt={`Page ${file.number}`}
                        ref={ref}
                        style={imgStyle}
                        className={type === 'sidebar' ? 'side-img' : 'main-img'}
                    />
                </div>
            </div>
        );
    }
);

export default ScannedPage;