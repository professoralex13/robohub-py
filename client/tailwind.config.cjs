/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'blue-light': '#64a9e9',
                'blue-dark': '#272838',
                'grey-light': '#eaeaea',
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
