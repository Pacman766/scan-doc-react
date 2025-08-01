import { useRef, useEffect, useCallback, useState } from 'react';

export const useIntersectionObserver = (
    scrollContainerRef,
    files,
    isZooming,
    setZooming,
    imageRefs,
) => {
    const observerRef = useRef(null);
    const [activePage, setActivePage] = useState(1);
    const isPageSelectionScroll = useRef(false);

    const onIntersection = useCallback((entries) => {
        // console.log("INTERSECTION OBSERVED", entries);
        if (isZooming || isPageSelectionScroll.current) return;

        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0){
            const topMost = visible[0].target;
            const index = imageRefs.current.findIndex(
                (ref) => ref === topMost || ref?.el === topMost
            );

            if (index !== -1){
                const newPage = index + 1;
                setActivePage(newPage);
                const sideEl = document.querySelectorAll('.side-img')[index];
                sideEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
        }

    }, [isZooming, imageRefs, activePage]);

    useEffect(() => {
        if (!imageRefs?.current.length || !scrollContainerRef?.current) {
            return;
        }

        observerRef.current = new IntersectionObserver(onIntersection, {
            root: scrollContainerRef.current,
            threshold: 0.2
        });


        imageRefs.current.forEach(ref => {
            const el = ref?.el || ref;
            el && observerRef.current.observe(el);
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [scrollContainerRef, imageRefs, files]);

    const scrollToPage = useCallback((page) => {
        const mainEl = imageRefs.current[page-1];
        if (mainEl) {
            isPageSelectionScroll.current = true;
            mainEl.scrollIntoView({ block: 'center' });
            const sideEl = document.querySelectorAll('.side-img')[page-1];
            sideEl?.scrollIntoView({ block: 'center'});
            setActivePage(page);
            setTimeout(() => {
                isPageSelectionScroll.current = false;
            }, 500)
        }
    }, [imageRefs]);

    return { activePage, setActivePage, scrollToPage };
};