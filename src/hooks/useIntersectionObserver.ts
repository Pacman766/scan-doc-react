import {useRef, useEffect, useCallback} from 'react';
import {useScanContext} from "../context/ScanContext";

export const useIntersectionObserver = () => {
    const {
        scrollContainerRef,
        files,
        isZooming,
        imageRefs,
        activePage,
        setActivePage,
    } = useScanContext();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isPageSelectionScroll = useRef<boolean>(false);

    const onIntersection: IntersectionObserverCallback = useCallback(
        (entries: IntersectionObserverEntry []) => {
        // console.log("INTERSECTION OBSERVED", entries);
        if (isZooming || isPageSelectionScroll.current) return;

        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topMostTarget = visible[0].target;
        const index = imageRefs.current.findIndex(ref => ref === topMostTarget);

        if (index !== -1){
            const newPage = index + 1;
            setActivePage(newPage);
            const sideEl = document.querySelectorAll('.side-img')[index];
            sideEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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


        imageRefs.current.forEach(el => {
            el && observerRef.current?.observe(el);
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [scrollContainerRef, imageRefs, files]);

    const scrollToPage = useCallback((page: number) => {
        const mainEl = imageRefs.current[page-1];
        if (mainEl instanceof HTMLImageElement) {
            isPageSelectionScroll.current = true;
            mainEl.scrollIntoView({ block: 'center' });
            const sideEl = document.querySelectorAll<HTMLImageElement>('.side-img')[page-1];
            sideEl?.scrollIntoView({ block: 'center'});
            setActivePage(page);
            setTimeout(() => {
                isPageSelectionScroll.current = false;
            }, 500)
        }
    }, [imageRefs]);

    return { scrollToPage };
};