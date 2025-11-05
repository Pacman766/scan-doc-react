import {useRef, useEffect, useCallback} from 'react';
import {useScanContext} from "../context/ScanContext";
import {useAppSelector} from "../store";
import {scrollSyncService, ScrollSource} from "../services/scrollSyncService";

export const useIntersectionObserver = () => {
    const {
        isZooming,
        imageRefs,
        setActivePage,
        mainScrollContainerRef,
    } = useScanContext();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isPageSelectionScroll = useRef<boolean>(false);
    const files = useAppSelector(state => state.files.pages);
    
    const onIntersection: IntersectionObserverCallback = useCallback(
        (entries: IntersectionObserverEntry []) => {
        // console.log("INTERSECTION OBSERVED", entries);
        if (isZooming || isPageSelectionScroll.current || scrollSyncService.getIsScrolling()) return;

        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        // Проверяем, что есть видимые элементы
        if (visible.length === 0) return;

        const topMostTarget = visible[0].target;
        const refs = imageRefs.current;
        if (!refs) return;
        const index = refs.findIndex(ref => ref === topMostTarget);

        if (index !== -1){
            const newPage = index + 1;
            setActivePage(newPage);
            // Отправляем событие через RxJS для синхронизации Sidebar
            scrollSyncService.emitScroll({
                page: newPage,
                source: ScrollSource.INTERSECTION,
                element: topMostTarget as HTMLElement
            });
        }

    }, [isZooming, imageRefs, setActivePage]);

    useEffect(() => {
        const refs = imageRefs?.current;
        if (!refs?.length || !mainScrollContainerRef?.current) {
            return;
        }

        observerRef.current = new IntersectionObserver(onIntersection, {
            root: mainScrollContainerRef.current,
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
    }, [mainScrollContainerRef, imageRefs, files, onIntersection]);

    // Подписка на события клика по страницам
    useEffect(() => {
        const subscription = scrollSyncService.pageClick$
            .subscribe((page: number) => {
                // Пропускаем если уже идет скролл
                if (scrollSyncService.getIsScrolling()) return;
                
                const refs = imageRefs.current;
                if (!refs) return;
                const mainEl = refs[page - 1];
                if (mainEl instanceof HTMLImageElement) {
                    isPageSelectionScroll.current = true;
                    scrollSyncService.setScrolling(true);
                    
                    mainEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    setActivePage(page);
                    
                    setTimeout(() => {
                        isPageSelectionScroll.current = false;
                        scrollSyncService.setScrolling(false);
                    }, 500);
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [imageRefs, setActivePage]);

    const scrollToPage = useCallback((page: number) => {
        // Отправляем событие через RxJS для синхронизации между компонентами
        scrollSyncService.emitPageClick(page);
    }, []);

    return { scrollToPage };
};