declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    disconnect: () => void;
    observe: (target: Element, options?: ResizeObserverObserveOptions) => void;
    unobserve: (target: Element) => void;
}