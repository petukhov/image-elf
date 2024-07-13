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
                primary: '#2AE5BC',
                secondary: '#5BD8BD',
                accent: '#99E0D1',
            },
        },
    },
    plugins: [],
};
