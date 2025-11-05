import React, { useEffect, useRef } from 'react';
import { Offcanvas } from "react-bootstrap";
import ScannedPages from "./ScannedPages";
import {useScanContext} from "../context/ScanContext";
import type {SidebarProps} from "../types/sidebar";
import {scrollSyncService, ScrollSource} from "../services/scrollSyncService";
import {debounceTime} from 'rxjs/operators';

const Sidebar = ({
                     showSidebar,
                     toggleSidebar,
                     scrollToPage,
                 }: SidebarProps) => {
    const sidebarContainerRef = useRef<HTMLDivElement | null>(null);
    const { activePage } = useScanContext();
    const isInternalScrollRef = useRef<boolean>(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Подписка на события скролла для синхронизации с MainWindow
    useEffect(() => {
        const subscription = scrollSyncService.scroll$
            .pipe(debounceTime(50))
            .subscribe((event) => {
                // Пропускаем события от самого Sidebar
                if (event.source === ScrollSource.SIDEBAR || scrollSyncService.getIsScrolling()) {
                    return;
                }

                // Синхронизируем скролл при событиях от MainWindow или Intersection
                if (event.source === ScrollSource.MAIN_WINDOW || event.source === ScrollSource.INTERSECTION) {
                    const sideEl = document.querySelectorAll<HTMLImageElement>('.side-img')[event.page - 1];
                    if (sideEl && sidebarContainerRef.current) {
                        isInternalScrollRef.current = true;
                        scrollSyncService.setScrolling(true);
                        
                        sideEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                        
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
    }, []);

    // Обработчик скролла Sidebar для отправки событий
    useEffect(() => {
        const container = sidebarContainerRef.current;
        if (!container) return;

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
                if (!container) return;

                // Находим видимую страницу в центре контейнера
                const containerRect = container.getBoundingClientRect();
                const centerY = containerRect.top + containerRect.height / 2;

                const sideImages = document.querySelectorAll<HTMLImageElement>('.side-img');
                let closestPage = activePage;
                let minDistance = Infinity;

                sideImages.forEach((img, index) => {
                    const rect = img.getBoundingClientRect();
                    const imgCenterY = rect.top + rect.height / 2;
                    const distance = Math.abs(centerY - imgCenterY);

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPage = index + 1;
                    }
                });

                // Отправляем событие скролла через RxJS
                if (closestPage !== activePage) {
                    const sideEl = sideImages[closestPage - 1];
                    scrollSyncService.emitScroll({
                        page: closestPage,
                        source: ScrollSource.SIDEBAR,
                        element: sideEl || undefined
                    });
                }
            }, 100);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activePage]);

    // Подписка на клики по страницам для синхронизации
    useEffect(() => {
        const subscription = scrollSyncService.pageClick$
            .subscribe((page: number) => {
                // Пропускаем если уже идет скролл
                if (scrollSyncService.getIsScrolling()) return;
                
                const sideEl = document.querySelectorAll<HTMLImageElement>('.side-img')[page - 1];
                if (sideEl && sidebarContainerRef.current) {
                    isInternalScrollRef.current = true;
                    scrollSyncService.setScrolling(true);
                    
                    sideEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    
                    setTimeout(() => {
                        isInternalScrollRef.current = false;
                        scrollSyncService.setScrolling(false);
                    }, 500);
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <Offcanvas
                show={showSidebar}
                onHide={toggleSidebar}
                placement="start"
                data-bs-theme="dark"
                className="z-1"
                style={{ width: 250 }}
                backdrop={false}
                scroll={true}
            >
                <Offcanvas.Header data-bs-theme="dark">
                </Offcanvas.Header>
                <Offcanvas.Body data-bs-theme="dark">
                    <div 
                        ref={sidebarContainerRef}
                        className="d-flex flex-column align-items-center gap-3"
                        style={{ overflowY: 'auto', marginTop: '30px', height: '100%' }}
                    >
                        <ScannedPages
                            onPageClick={(page) => {
                                // Сообщаем о клике (для совместимости с хуком)
                                scrollToPage(page);
                                // Явно отправляем событие SIDEBAR, чтобы MainWindow отскроллил
                                const sideEl = document.querySelectorAll<HTMLImageElement>('.side-img')[page - 1];
                                scrollSyncService.emitScroll({
                                    page,
                                    source: ScrollSource.SIDEBAR,
                                    element: sideEl || undefined
                                });
                            }}
                            highlightActive={true}
                            type="sidebar"
                        />
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;