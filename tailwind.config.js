/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#2AE5BC',
                secondary: '#5BD8BD',
                accent: '#99E0D1',
            },
        },
    },
    plugins: [],
};
