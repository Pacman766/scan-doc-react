import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Custom hook to observe elements for intersection and update an active page state.
 *
 * @param {React.MutableRefObject<HTMLElement>} scrollContainerRef - Ref to the scrollable container (root for the observer).
 * @param {number} initialActivePage - The initial page number.
 * @returns {{activePage: number, setActivePage: Function, setObservedElementRef: Function}}
 */
export const useIntersectionObserver = (scrollContainerRef, initialActivePage = 1) => {
    const observerRef = useRef(null);
    const observedElements = useRef(new Map()); // Use a Map to store observed elements
    const [activePage, setActivePage] = useState(initialActivePage);

    // Callback to assign to elements that should be observed
    // This allows us to track elements dynamically added/removed
    const setObservedElementRef = useCallback((pageNumber, element) => {
        if (element) {
            observedElements.current.set(pageNumber, element);
            if (observerRef.current) {
                observerRef.current.observe(element);
            }
        } else {
            // If element is null, it means the component unmounted.
            // Disconnect if it was being observed.
            const existingElement = observedElements.current.get(pageNumber);
            if (existingElement && observerRef.current) {
                observerRef.current.unobserve(existingElement);
            }
            observedElements.current.delete(pageNumber);
        }
    }, []); // No dependencies, as observedElements.current and observerRef.current are stable refs

    const handleIntersection = useCallback((entries) => {
        const intersectingEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => {
                const aRatio = a.intersectionRatio;
                const bRatio = b.intersectionRatio;
                // Prioritize fully visible items
                if (aRatio === 1 && bRatio < 1) return -1;
                if (bRatio === 1 && aRatio < 1) return 1;
                // Otherwise, sort by highest intersection ratio
                return bRatio - aRatio;
            });

        if (intersectingEntries.length > 0) {
            const mostVisiblePageId = intersectingEntries[0].target.dataset.page;
            const pageNum = parseInt(mostVisiblePageId, 10);
            setActivePage(pageNum); // Update the active page state managed by the hook
        }
    }, []); // No dependencies for this useCallback, as setActivePage is a state setter and stable

    useEffect(() => {
        if (!scrollContainerRef.current) {
            return; // Don't create observer if root is not available
        }

        // Create a new IntersectionObserver
        observerRef.current = new IntersectionObserver(handleIntersection, {
            root: scrollContainerRef.current,
            rootMargin: '0px',
            threshold: [0.1, 0.5, 0.9] // Observe at these visibility thresholds
        });

        // Observe all currently registered elements
        observedElements.current.forEach(element => {
            if (element) {
                observerRef.current.observe(element);
            }
        });

        // Cleanup function: disconnect the observer when the component unmounts
        // or when scrollContainerRef changes
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null; // Clear observer reference
            }
        };
    }, [scrollContainerRef, handleIntersection]); // Re-create observer if root changes or handleIntersection (stable) changes

    // Return the activePage state and the ref setter for elements
    return { activePage, setActivePage, setObservedElementRef };
};