import tailwindcssTypography from '@tailwindcss/typography';
import tailwindcssForms from '@tailwindcss/forms';
import daisyui from 'daisyui';

import type { Config } from 'tailwindcss';

export default {
  content: [
    './public/**/*.{html,js}',
    './src/**/*.{html,js,ts}',

    './index.html',
    './auth/**/*.{html,js}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Custom Font', 'Nunito'],
      },
      height: {
        '1/8': '12.5%',
      },
    },
  },
  plugins: [tailwindcssTypography, tailwindcssForms, daisyui],
  daisyui: {
    themes: ['dark', 'light', 'cupcake'],
  },
} satisfies Config;
