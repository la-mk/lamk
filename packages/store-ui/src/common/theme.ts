import { BlocksTheme, DeepPartial } from '@sradevski/blocks-ui/dist/theme';
import tinycolor from 'tinycolor2';

const getOtherColors = (brandColor: string) => {
  const brand = tinycolor(brandColor).toHsl();

  return {
    background: {
      light: tinycolor({ h: brand.h, s: 0.3, l: 0.97 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.92, l: 0.08 }).toHexString(),
    },

    heading: {
      light: tinycolor({ h: brand.h, s: 0.5, l: 0.95 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.92, l: 0.04 }).toHexString(),
    },

    text: {
      light: tinycolor({ h: brand.h, s: 0.2, l: 0.95 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.25, l: 0.35 }).toHexString(),
    },

    mutedText: {
      light: tinycolor({ h: brand.h, s: 0.1, l: 0.85 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.15, l: 0.62 }).toHexString(),
    },
  };
};

export const getTheme = (brandColor = '#EF4351'): DeepPartial<BlocksTheme> => {
  return {
    colors: {
      primary: brandColor,
      success: '#5CB85C',
      ...getOtherColors(brandColor),
    },

    components: {
      Heading: {
        sizes: {
          '4xl': {
            fontSize: ['6xl', null, '7xl'],
            lineHeight: 1,
          },
          '3xl': {
            fontSize: ['5xl', null, '6xl'],
            lineHeight: 1,
          },
          '2xl': {
            fontSize: ['4xl', null, '5xl'],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ['3xl', null, '4xl'],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ['2xl', null, '3xl'],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: '2xl', lineHeight: 1.2 },
          sm: { fontSize: 'lg', lineHeight: 1.2 },
          xs: { fontSize: 'md', lineHeight: 1.2 },
        },
      },
    },
  };
};
