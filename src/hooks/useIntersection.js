import { useRef, useEffect, useCallback, useState } from 'react';

export const useIntersectionObserver = (
    scrollContainerRef,
    initialActivePage,
    files,
    isZooming,
    setZooming,
    imageRefs,
) => {
    const observerRef = useRef(null);
    const [activePage, setActivePage] = useState(initialActivePage);
    let isFirstTimeObserve = false;

    useEffect(() => {
        isFirstTimeObserve = true;
    }, [])

    const onIntersection = useCallback((entries, observerRef) => {
        if (isFirstTimeObserve){
            setActivePage(1);
            isFirstTimeObserve = false;
        } else if (isZooming){
            entries.forEach((entry, i, entrs) => {
                if (entry.isIntersecting && imageRefs.current) {
                    const  elements = imageRefs
                        .filter(page => page !== null)
                        .map(page => page?.el)
                    let pageIndex = elements.indexOf(entry.target);
                    if (pageIndex !== -1) {
                        setActivePage(pageIndex+1);
                        const selElement = document.querySelectorAll('.side-img')[pageIndex];
                        selElement && selElement.scrollIntoView({ block: 'center'});
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(onIntersection, {
            root: null,
            rootMargin: '',
            threshold: 0.2
        });

        if (imageRefs.current && imageRefs.current.length > 0){
            imageRefs.current.forEach(img => {
                const element = (img && img.el) || img;
                if (element) {
                    observerRef.current.observe(element);
                }
            });
        }
    }, [files, imageRefs]);

    const scrollToPage = useCallback((pageIndex) => {
        const el = imageRefs.current[pageIndex-1];
        if (el) {
            el.scrollIntoView({ block: 'center' });
        }
    }, [imageRefs]);

    return { activePage, setActivePage, scrollToPage };
};