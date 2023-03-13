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
                    100: '#e0eefb',
                    200: '#c1ddf6',
                    300: '#a2cbf2',
                    400: '#83baed',
                    500: '#64a9e9',
                    600: '#5087ba',
                    700: '#3c658c',
                    800: '#28445d',
                    900: '#14222f',
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
        },
    },
    plugins: [],
};
