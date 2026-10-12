/// <reference types="vite/client" />

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.jpeg' {
    const src: string;
    export default src;
}

declare module '*.gif' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare module '*.module.css';
declare module '*.css';

declare namespace React {
    type ReactNode = any;
    interface FC<P = {}> {
        (props: P): any;
    }
}

declare module 'react' {
    export = React;
    export as namespace React;
    export const useState: <S>(initialState: S | (() => S)) => [S, (value: S) => void];
    export const useEffect: (effect: (...args: any[]) => any, deps?: any[]) => void;
    export const useMemo: <T>(factory: () => T, deps?: any[]) => T;
    export const useRef: <T>(initialValue: T) => { current: T };
    export const useCallback: <T extends (...args: any[]) => any>(fn: T, deps?: any[]) => T;
    export const createContext: <T>(defaultValue: T) => any;
    export const useContext: <T>(context: any) => T;
    export const Fragment: any;
}

declare module 'react/jsx-runtime' {
    export const jsx: any;
    export const jsxs: any;
    export const Fragment: any;
}

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
