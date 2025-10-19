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
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 10px 30px -3px rgba(15, 23, 42, 0.08)',
                'premium-hover': '0 20px 30px -3px rgba(15, 23, 42, 0.12)',
                'card': '0 2px 15px rgba(0, 0, 0, 0.04)',
            },
            backgroundImage: {
                'gradient-premium': 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                'gradient-gold': 'linear-gradient(135deg, #c8a355 0%, #e9d8a6 100%)',
            },
        }
    },
    plugins: []
}