import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.{html,js}',
    './src/**/*.{html,js,ts}',

    './index.html',
    './auth/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Custom Font', 'Nunito'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
};
