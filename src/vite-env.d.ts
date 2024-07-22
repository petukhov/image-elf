/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

export {};
