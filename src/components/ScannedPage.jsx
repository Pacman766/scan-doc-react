// src/ScannedPage.jsx
import React, {forwardRef} from 'react';
import scannedPages from "./ScannedPages";

const ScannedPage = forwardRef(
    ({
         file,
         index,
         onClick,
         highlight,
         type,
         rotationMap,
         fitMode,
         mainWindowHeight,
         mainWindowWidth,
         setScale,
         scale,
         onImageLoad
     }, ref) => {

        const handleClick = () => {
            if (onClick) {
                onClick(file.number);
            }
        };

        onImageLoad=(naturalWidth, naturalHeight) => {
            if (type === 'main') {
                const rotation = rotationMap?.[index] || 0;
                let scaleValue = 100;

                if (fitMode === 'height') {
                    const imageDisplayHeight = mainWindowHeight - 100;
                    const baseHeight = (rotation % 180 === 0) ? naturalHeight : naturalWidth;
                    scaleValue = Math.round((imageDisplayHeight / baseHeight) * 100);
                } else if (fitMode === 'width') {
                    const imageDisplayWidth = mainWindowWidth - 340;
                    const baseWidth = (rotation % 180 === 0) ? naturalWidth : naturalHeight;
                    scaleValue = Math.round((imageDisplayWidth / baseWidth) * 100);
                }

                setScale(scaleValue);
            }
        }


        const imageStyle = {
            borderRadius: '6px',
            marginBottom: '5px',
            border: highlight ? '3px solid #0d6efd' : 'none',
            objectFit: 'contain', // Important: maintains aspect ratio
            maxWidth: 'unset', // Remove any restrictive max-width/height here
            maxHeight: 'unset',
            transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out'
        };

        const pageContainerStyle = {
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'end',
            cursor: onClick ? 'pointer' : 'default',
            scrollSnapAlign: 'start',
            scrollMarginTop: '60px',
            width: '100%', // Container spans full width to allow centering
            boxSizing: 'border-box',
            paddingLeft: type === 'main' ? '20px' : '0', // Add some horizontal padding for main images
            paddingRight: type === 'main' ? '20px' : '0',
        };

        let calculatedImageWidth = 'auto';
        let calculatedImageHeight = 'auto';

        if (type === 'main') {
            const viewportPadding = 100; // Total vertical padding/margins for image
            const viewportHorizontalPadding = 40; // Total horizontal padding/margins for image

            if (fitMode === 'height') {
                calculatedImageHeight = `${mainWindowHeight - viewportPadding}px`;
                calculatedImageWidth = 'auto';
            } else if (fitMode === 'width') {
                calculatedImageWidth = `${mainWindowWidth - viewportHorizontalPadding-300}px`;
                calculatedImageHeight = 'auto';
                setScale(100);
            }
        } else { // Sidebar images (thumbnails)
            calculatedImageWidth = '120px';
            calculatedImageHeight = 'auto';
            // Override padding for sidebar thumbnails if necessary
            pageContainerStyle.paddingLeft = '0';
            pageContainerStyle.paddingRight = '0';
        }

        return (
            <div
                ref={ref}
                className="scanned-page-container"
                onClick={handleClick}
                style={pageContainerStyle}
                data-page={file.number}
            >
                <img
                    src={file.content}
                    alt={`Page ${file.number}`}
                    style={{
                        ...imageStyle,
                        transform: `rotate(-${rotationMap?.[index] || 0}deg) scale(${scale / 100})`,
                        width: calculatedImageWidth,
                        height: calculatedImageHeight,
                    }}
                    onLoad={(e) => {
                        if (onImageLoad) {
                            const img = e.target;
                            onImageLoad(img.naturalWidth, img.naturalHeight);
                        }
                    }}
                />
                {type === 'sidebar' ? file.number : ''}
            </div>
        );
    }
);

export default ScannedPage;