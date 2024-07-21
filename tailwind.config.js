import imageConfig from './src/image-config.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 1s ease-in-out',
            },
            colors: {
                primary: imageConfig.colors.primary,
                secondary: imageConfig.colors.secondary,
                accent: imageConfig.colors.accent,
            },
        },
    },
    plugins: [],
};
