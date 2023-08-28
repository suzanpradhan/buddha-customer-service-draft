/** @type {import('tailwindcss').Config} */

function generateTemplateGridRowsOrCols(startValue, lastValue) {
  let obj = {};
  for (let i = startValue; i < lastValue; i++) {
    obj[`${i}`] = `repeat(${i}, minmax(0, 1fr))`;
  }
  return obj;
}

function generateGridRowsOrCols(startValue, lastValue) {
  let obj = {};
  for (let i = startValue; i < lastValue; i++) {
    obj[`span-${i}`] = `span ${i} / span ${i};`;
  }
  return obj;
}

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/core/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        ...generateTemplateGridRowsOrCols(13, 100), // This generates the columns from 12 until 100
      },
      gridTemplateRows: {
        ...generateTemplateGridRowsOrCols(7, 100), // This generates the columns from 12 until 100
      },
      // gridColumn: {
      //   ...generateGridRowsOrCols(13, 100),
      // },
      // gridRow: {
      //   ...generateGridRowsOrCols(7, 100),
      // },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        whiteShade: '#F2F3F5',
        blueWhite: '#F5F8FA',
        accent: '#CBA22E',
        accentBlue: {
          50: '#E2EFFF',
          100: '#B3D5FF',
          300: '#347bd3',
          400: '#2560AA',
          500: '#1454A4',
          900: '#0b2d58',
        },
        primaryGray: {
          300: '#DEDEE0',
          500: '#717172',
        },
        dark: {
          500: '#2D2D2E',
        },
      },
      fontFamily: {
        sans: ['var(--font-helvetica)'],
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
