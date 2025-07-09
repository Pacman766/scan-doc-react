// src/ScannedPage.jsx
import React, {forwardRef} from 'react';

const ScannedPage = forwardRef(
    ({
         file,
         index,
         onClick,
         highlight,
         type,
         rotationMap,
         fitMode, // Received
         mainWindowHeight, // Received
         mainWindowWidth, // Received
         scale // Received
     }, ref) => {

        const handleClick = () => {
            if (onClick) {
                onClick(file.number);
            }
        };

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
            paddingRight: type === 'main' ? '20px' : '0'
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
            }
            else { // fitMode === 'manual'
                calculatedImageWidth = `${scale}%`; // Use scale for manual zoom
                calculatedImageHeight = 'auto'; // Maintain aspect ratio
                // You could also apply scale to height:
                // calculatedImageHeight = `${scale}%`;
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
                        transform: `rotate(-${rotationMap?.[index] || 0}deg)`,
                        width: calculatedImageWidth,
                        height: calculatedImageHeight,
                        // Ensure image doesn't overflow its parent even if scale is huge
                        // These max values refer to the *container's* size, which we want the image to fill.
                        // They are generally redundant if width/height are set directly, but can be a safeguard.
                        // Removed for direct width/height setting, object-fit handles the rest.
                        // maxWidth: `${mainWindowWidth - viewportHorizontalPadding}px`,
                        // maxHeight: `${mainWindowHeight - viewportPadding}px`,
                    }}
                />
                {type === 'sidebar' ? file.number : ''}
            </div>
        );
    }
);

export default ScannedPage;