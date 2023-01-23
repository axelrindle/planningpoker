/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif']
        },
        extend: {
            colors: {
                primary: '#134094',
                secondary: '#3da3dc',
                accent: '#dc763d',
                overlay: 'rgba(0, 0, 0, .7)'
            },
            gridTemplateColumns: {
                header: 'minmax(0, 1fr) auto'
            }
        },
    },
    plugins: [],
}
