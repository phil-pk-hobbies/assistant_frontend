/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                accent: 'var(--accentBlue)',
                error: 'var(--errorRed)',
                grey90: 'var(--grey90)',
                grey60: 'var(--grey60)',
            },
        },
    },
    plugins: [],
};