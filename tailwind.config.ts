import { Config } from 'tailwindcss'

const tailwindConfig = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter", sans-serif',
          { fontFeatureSettings: '"liga" 1, "calt" 1' },
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', '0.875rem'],
      },
      keyframes: {
        skinOfTheMatchFloat: {
          '0%': {
            transform: 'translate(0)',
            filter:
              'saturate(1.25) brightness(1.25) drop-shadow(0px 4px 3px black)',
          },
          '50%': {
            transform: 'translate(0, -4px)',
            filter:
              'saturate(1.25) brightness(1.25) drop-shadow(0px 8px 7px black)',
          },
          '100%': {
            transform: 'translate(0)',
            filter:
              'saturate(1.25) brightness(1.25) drop-shadow(0px 4px 3px black)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default tailwindConfig
