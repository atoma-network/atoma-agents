/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              backgroundColor: '#f3f4f6',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              overflowX: 'auto',
              color: '#1f2937'
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
