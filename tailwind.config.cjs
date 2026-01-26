module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a',
                accent: '#0284c7',
                gold: '#c8a355',
                'gold-light': '#e9d8a6',
                platinum: '#e2e8f0',
                'slate-850': '#1e293b',
                'neutral-750': '#2d3748',
                'premium': {
                    50: '#F6F8FD',
                    100: '#EDF0FC',
                    200: '#DBE0F9',
                    300: '#C0C9F4',
                    400: '#A5AEEE',
                    500: '#8A93E8',
                    600: '#7078E2',
                    700: '#565DDC',
                    800: '#3B42D6',
                    900: '#2027D0'
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 10px 30px -3px rgba(15, 23, 42, 0.08)',
                'premium-hover': '0 20px 30px -3px rgba(15, 23, 42, 0.12)',
                'card': '0 2px 15px rgba(0, 0, 0, 0.04)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'neu': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
                'premium-dark': '0 10px 25px rgba(0, 0, 0, 0.25)',
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                'gradient-gold': 'linear-gradient(135deg, #c8a355 0%, #e9d8a6 100%)',
                'gradient-modern': 'linear-gradient(120deg, #565DDC 0%, #3B42D6 100%)',
                'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                'gradient-premium-light': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            },
            dropShadow: {
                'premium': '0 10px 15px rgba(0, 0, 0, 0.1)',
                'text': '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blob': 'blob 7s infinite',
                'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
                'fadeInDown': 'fadeInDown 0.8s ease-out forwards',
                'scaleIn': 'scaleIn 0.6s ease-out forwards',
                'slideInLeft': 'slideInLeft 0.8s ease-out forwards',
                'slideInRight': 'slideInRight 0.8s ease-out forwards',
                'bounce-slow': 'bounce 3s infinite',
                'spin-slow': 'spin 3s linear infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    '0%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                fadeInDown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                scaleIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.9)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)',
                    },
                },
                slideInLeft: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-50px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                slideInRight: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(50px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-position': '0% 50%',
                    },
                    '50%': {
                        'background-position': '100% 50%',
                    },
                },
                'glow-pulse': {
                    '0%, 100%': {
                        'box-shadow': '0 0 20px rgba(59, 130, 246, 0.5)',
                    },
                    '50%': {
                        'box-shadow': '0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(249, 115, 22, 0.6)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)',
                    },
                    '50%': {
                        transform: 'translateY(-20px)',
                    },
                },
            },
            backgroundSize: {
                'size-200': '200% 200%',
            },
            backgroundPosition: {
                'pos-0': '0% 0%',
                'pos-100': '100% 100%',
            },
        }
    },
    plugins: []
}