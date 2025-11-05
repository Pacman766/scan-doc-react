import {useRef, useEffect, useCallback} from 'react';
import {useScanContext} from "../context/ScanContext";
import {useAppSelector} from "../store";

export const useIntersectionObserver = () => {
    const {
        scrollContainerRef,
        isZooming,
        imageRefs,
        activePage,
        setActivePage,
    } = useScanContext();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isPageSelectionScroll = useRef<boolean>(false);
    const files = useAppSelector(state => state.files.pages);
    const onIntersection: IntersectionObserverCallback = useCallback(
        (entries: IntersectionObserverEntry []) => {
        // console.log("INTERSECTION OBSERVED", entries);
        if (isZooming || isPageSelectionScroll.current) return;

        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const topMostTarget = visible[0].target;
        const refs = imageRefs.current;
        if (!refs) return;
        const index = refs.findIndex(ref => ref === topMostTarget);

        if (index !== -1){
            const newPage = index + 1;
            setActivePage(newPage);
            const sideEl = document.querySelectorAll('.side-img')[index];
            sideEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

    }, [isZooming, imageRefs, activePage]);

    useEffect(() => {
        const refs = imageRefs?.current;
        if (!refs?.length || !scrollContainerRef?.current) {
            return;
        }

        observerRef.current = new IntersectionObserver(onIntersection, {
            root: scrollContainerRef.current,
            threshold: 0.2
        });


        if (refs) {
            refs.forEach(el => {
                el && observerRef.current?.observe(el);
            });
        }

        return () => {
            observerRef.current?.disconnect();
        };
    }, [scrollContainerRef, imageRefs, files]);

    const scrollToPage = useCallback((page: number) => {
        const refs = imageRefs.current;
        if (!refs) return;
        const mainEl = refs[page-1];
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