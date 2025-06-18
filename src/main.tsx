import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './routes';
import { LocalizedStrings } from './types';

// Check that window.l10n object has all the keys defined in LocalizedStrings enum
if (window.l10n) {
    const missingKeys = Object.keys(LocalizedStrings).filter(
        (key) => !(key in window.l10n),
    );
    if (missingKeys.length > 0) {
        console.error(
            `Missing localization keys in window.l10n: ${missingKeys.join(', ')}`,
        );
    }
} else {
    console.error('window.l10n is not defined');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>,
);
