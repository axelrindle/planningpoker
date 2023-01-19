/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#134094',
                secondary: '#3da3dc',
                accent: '#dc763d'
            },
            gridTemplateColumns: {
                header: 'minmax(0, 1fr) auto'
            }
        },
    },
    plugins: [],
}
