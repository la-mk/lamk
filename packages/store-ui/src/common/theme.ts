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

export const getTheme = (brandColor = '#EF4351') => {
  return {
    colors: {
      primary: brandColor,
      success: '#5CB85C',

      ...getOtherColors(brandColor),
    },
  };
};
