import React, {ForwardedRef, useEffect, useRef} from 'react';
import ScannedPages from "./ScannedPages";
import {useScanContext} from "../context/ScanContext";
import {scrollSyncService, ScrollSource} from "../services/scrollSyncService";
import {debounceTime} from 'rxjs/operators';

interface MainWindowProps {
    scrollToPage: (page: number) => void;
    showSidebar: boolean;
}

const MainWindow = React.forwardRef<HTMLDivElement, MainWindowProps>(({
                                         scrollToPage,
                                         showSidebar,
                                     }, mainScrollContainerRef: ForwardedRef<HTMLDivElement>) => {
    const { imageRefs, activePage } = useScanContext();
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInternalScrollRef = useRef<boolean>(false);

    // Отключаем скролл body, чтобы не было двойного вертикального скролла
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Обработчик скролла для синхронизации с Sidebar
    useEffect(() => {
        const container = mainScrollContainerRef as React.RefObject<HTMLDivElement>;
        if (!container?.current) return;

        const handleScroll = () => {
            // Пропускаем если скролл инициирован программно
            if (scrollSyncService.getIsScrolling() || isInternalScrollRef.current) {
                return;
            }

            // Очищаем предыдущий таймаут
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Дебаунсим скролл для оптимизации
            scrollTimeoutRef.current = setTimeout(() => {
                const refs = imageRefs.current;
                if (!refs || !container.current) return;

                // Находим видимую страницу в центре контейнера
                const containerRect = container.current.getBoundingClientRect();
                const centerY = containerRect.top + containerRect.height / 2;

                let closestPage = activePage;
                let minDistance = Infinity;

                refs.forEach((ref, index) => {
                    if (ref) {
                        const rect = ref.getBoundingClientRect();
                        const pageCenterY = rect.top + rect.height / 2;
                        const distance = Math.abs(centerY - pageCenterY);

                        if (distance < minDistance) {
                            minDistance = distance;
                            closestPage = index + 1;
                        }
                    }
                });

                // Отправляем событие скролла через RxJS
                if (closestPage !== activePage) {
                    scrollSyncService.emitScroll({
                        page: closestPage,
                        source: ScrollSource.MAIN_WINDOW
                    });
                }
            }, 100);
        };

        container.current.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (container.current) {
                container.current.removeEventListener('scroll', handleScroll);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [mainScrollContainerRef, imageRefs, activePage]);

    // Подписка на события скролла для синхронизации
    useEffect(() => {
        const subscription = scrollSyncService.scroll$
            .pipe(debounceTime(50))
            .subscribe((event) => {
                // Пропускаем события от самого MainWindow
                if (event.source === ScrollSource.MAIN_WINDOW || event.source === ScrollSource.INTERSECTION) {
                    return;
                }

                // Синхронизируем скролл при событиях от Sidebar
                if (event.source === ScrollSource.SIDEBAR && event.element) {
                    const refs = imageRefs.current;
                    if (!refs) return;
                    
                    const index = event.page - 1;
                    const mainEl = refs[index];
                    if (mainEl instanceof HTMLImageElement) {
                        isInternalScrollRef.current = true;
                        scrollSyncService.setScrolling(true);
                        
                        mainEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        
                        setTimeout(() => {
                            isInternalScrollRef.current = false;
                            scrollSyncService.setScrolling(false);
                        }, 500);
                    }
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [imageRefs]);

    return (
        <div
            ref={mainScrollContainerRef}
            style={{
                flexGrow: 1,
                overflowY: 'scroll',
                height: '100vh',
                scrollBehavior: 'smooth',
                scrollSnapType: 'y proximity',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '60px',
                paddingBottom: '20px',
                transform: showSidebar ? 'translateX(125px)' : 'translateX(0px)',
                transition: 'transform 0.3s ease-in-out'
            }}
            className="main-window-scroll-container"
        >
            <ScannedPages
                onPageClick={(page) => {
                    // Сообщаем о клике (для совместимости с хуком)
                    scrollToPage(page);
                    // Явно отправляем событие MAIN_WINDOW, чтобы Sidebar отскроллил
                    const mainImages = document.querySelectorAll<HTMLImageElement>('.main-img');
                    const mainEl = mainImages[page - 1];
                    scrollSyncService.emitScroll({
                        page,
                        source: ScrollSource.MAIN_WINDOW,
                        element: mainEl || undefined
                    });
                }}
                highlightActive={false}
                type="main"
            />
        </div>
    );
});

export default MainWindow;