/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#1D9E75',
        purple: '#7F77DD',
        coral: '#D85A30',
        navy: '#0B1628',
        surface: '#111E35',
      },
      borderRadius: { xl2: '28px', xl3: '44px' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};