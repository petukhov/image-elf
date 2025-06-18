/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { LocalizedStrings } from './types';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
        l10n: Record<LocalizedStrings, string>;
    }
}

export {};
