import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options) => {
    const [entry, setEntry] = useState(null);
    const nodeRef = useRef(null);
    const observerRef = useRef(null);

    const setNode = (node) => {
        if (nodeRef.current && observerRef.current) {
            observerRef.current.unobserve(nodeRef.current);
        }
        nodeRef.current = node;
        if (node) {
            if (!observerRef.current) {
                observerRef.current = new IntersectionObserver(([newEntry]) => {
                    setEntry(newEntry);
                }, options);
            }
            observerRef.current.observe(node);
        }
    };

    useEffect(() => {
        // Initial observer creation, if node is already set before first render
        if (nodeRef.current && !observerRef.current) {
            observerRef.current = new IntersectionObserver(([newEntry]) => {
                setEntry(newEntry);
            }, options);
            observerRef.current.observe(nodeRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null; // Clear the ref on unmount
            }
        };
    }, [options]); // Depend on options, recreate observer if they change

    return [setNode, entry];
};

export default useIntersectionObserver;