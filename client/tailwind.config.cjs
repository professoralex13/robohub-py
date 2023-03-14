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
        },
    },
    plugins: [],
};
