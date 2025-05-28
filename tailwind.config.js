/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                danger: 'var(--color-danger)',
                neutral1: 'var(--color-neutral-1)',
                neutral2: 'var(--color-neutral-2)',
                neutral3: 'var(--color-neutral-3)',
                neutral4: 'var(--color-neutral-4)',
                neutral5: 'var(--color-neutral-5)',
                neutral6: 'var(--color-neutral-6)',
                neutral7: 'var(--color-neutral-7)',
                neutral8: 'var(--color-neutral-8)',
                "on-primary": 'var(--text-on-primary)',
            },
            spacing: {
                1: 'var(--sp-1)',
                2: 'var(--sp-2)',
                3: 'var(--sp-3)',
                4: 'var(--sp-4)',
                5: 'var(--sp-5)',
                6: 'var(--sp-6)',
                7: 'var(--sp-7)',
                8: 'var(--sp-8)',
            },
            borderRadius: {
                sm: 'var(--br-sm)',
                lg: 'var(--br-lg)',
            },
            fontSize: {
                sm: 'var(--fs-sm)',
                base: 'var(--fs-base)',
                lg: 'var(--fs-lg)',
                xl: 'var(--fs-xl)',
                '2xl': 'var(--fs-2xl)',
                '3xl': 'var(--fs-3xl)',
            },
            fontFamily: {
                sans: ['var(--font-stack)'],
            },
        },
    },
    plugins: [],
};