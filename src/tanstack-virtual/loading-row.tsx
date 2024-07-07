import { FC, useEffect, useRef, useCallback } from 'react';

const options = {
    root: document.querySelector("#list"),
    rootMargin: "0px",
    threshold: 0,
};

interface LoadingRowProps {
    fetchData: () => Promise<void>;
}

export const LoadingRow: FC<LoadingRowProps> = ({ fetchData }) => {
    const callback = useCallback((entries: any[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fetchData();
            }
          });
    }, []);

    const ref = useRef(null);
    const observerRef = useRef(new IntersectionObserver(callback, options));

    useEffect(() => {
        if (ref.current && observerRef.current) {
            observerRef.current.observe(ref.current);
        }
    }, []);
  
    return (
        <div ref={ref} style={{
            height: `20px`,
            border: '1px solid #000',
            background: 'green',
        }}/>
    );
};