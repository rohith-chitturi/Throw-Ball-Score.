/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10b981', // Neon Emerald Green
                secondary: '#059669', // Darker Green
                dark: '#000000', // OLED Black
            }
        },
    },
    plugins: [],
}
