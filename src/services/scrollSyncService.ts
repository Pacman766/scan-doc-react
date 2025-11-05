import { Subject, BehaviorSubject } from 'rxjs';

export enum ScrollSource {
    MAIN_WINDOW = 'main',
    SIDEBAR = 'sidebar',
    INTERSECTION = 'intersection'
}

export interface ScrollEvent {
    page: number;
    source: ScrollSource;
    element?: HTMLElement;
}

class ScrollSyncService {
    private scrollSubject = new Subject<ScrollEvent>();
    private pageClickSubject = new Subject<number>();
    private isScrollingRef = new BehaviorSubject<boolean>(false);

    // Observable для подписки на события скролла
    scroll$ = this.scrollSubject.asObservable();
    
    // Observable для подписки на клики по страницам
    pageClick$ = this.pageClickSubject.asObservable();
    
    // Observable для отслеживания состояния скролла
    isScrolling$ = this.isScrollingRef.asObservable();

    /**
     * Отправляет событие скролла
     */
    emitScroll(event: ScrollEvent): void {
        this.scrollSubject.next(event);
    }

    /**
     * Отправляет событие клика по странице
     */
    emitPageClick(page: number): void {
        this.pageClickSubject.next(page);
    }

    /**
     * Устанавливает флаг скролла (для предотвращения циклических обновлений)
     */
    setScrolling(value: boolean): void {
        this.isScrollingRef.next(value);
    }

    /**
     * Получает текущее значение флага скролла
     */
    getIsScrolling(): boolean {
        return this.isScrollingRef.getValue();
    }
}

export const scrollSyncService = new ScrollSyncService();

