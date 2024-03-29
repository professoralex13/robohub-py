/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#C1DDF6',
                    100: '#A2CBF2',
                    200: '#83BAED',
                    300: '#64A9E9',
                    400: '#5087BA',
                    500: '#3C658C',
                    600: '#28445D',
                    700: '#1E3346',
                    800: '#192B3B',
                    900: '#14222F',
                },
            },
            fontFamily: {
                sans: ['Product Sans', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '17px',
            },
            boxShadow: {
                button: 'inset 4px 4px 6px rgba(0, 0, 0, 0.5);',
            },
            keyframes: {
                expandDown: {
                    '0%': { clipPath: 'inset(0 0 100% 0)' },
                    '100%': { clipPath: 'inset(0)' },
                },
                fadeUp: {
                    '0%': { opacity: 0, transform: 'translateY(50px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            animation: {
                expandDown: 'expandDown 250ms ease',
                expandDownRev: 'expandDown 250ms ease reverse forwards', // Fill mode must be forwards so it does not reset before unmounting
                fadeUp: 'fadeUp 250ms ease',
                fadeUpRev: 'fadeUp 250ms ease reverse forwards',
                fadeIn: 'fadeIn 250ms ease',
                fadeInRev: 'fadeIn 250ms ease reverse forwards',
            },
        },
    },
    plugins: [],
};
