import { useState, useLayoutEffect, RefObject } from "react";

const getSize = (conatinerEL: HTMLElement | null) => ({
    width: conatinerEL?.clientWidth || 0,
    height: conatinerEL?.clientHeight || 0
});
export default (containerRef: RefObject<HTMLElement | null>) => {
    const [size, updateSize] = useState({ width: 0, height: 0 });
    useLayoutEffect(() => {
        if (containerRef.current) {
            updateSize(getSize(containerRef.current));
            const handleResize = () => {
                updateSize(getSize(containerRef.current));
            };
            const x = new ResizeObserver(handleResize);
            x.observe(containerRef.current);
            // containerRef.current.addEventListener("resize", handleResize);
            // return () =>  containerRef.current.removeEventListener("resize", handleResize);
            return () => x.disconnect();
        }
    }, [containerRef.current]);

    return size;
};
