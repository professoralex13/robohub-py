/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    dark: '#272838',
                    medium: '#2a2d47',
                    light: '#64a9e9',
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
