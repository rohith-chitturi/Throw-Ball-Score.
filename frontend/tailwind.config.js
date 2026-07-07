/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                charcoal: '#0F1115',
                'midnight-blue': '#0A0F1C',
                dark: '#000000',
                
                // Accents
                primary: '#10b981', // Emerald Green (Throwball / Success)
                secondary: '#3b82f6', // Electric Blue (Information)
                accent: '#f97316', // Vibrant Orange (Action / Live)
                badminton: '#8b5cf6', // Violet (Badminton)
                gold: '#fbbf24', // Gold (Achievements)
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fadeIn 0.5s ease-out',
                'flip': 'flip 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px theme("colors.primary/0.2"), 0 0 20px theme("colors.primary/0.2")' },
                    '100%': { boxShadow: '0 0 10px theme("colors.primary/0.5"), 0 0 40px theme("colors.primary/0.5")' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                flip: {
                    '0%': { transform: 'rotateX(-90deg)' },
                    '100%': { transform: 'rotateX(0)' },
                }
            }
        },
    },
    plugins: [],
}
