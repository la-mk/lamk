import tinycolor from 'tinycolor2';
import { extendTheme, Theme as ChakraTheme } from '@chakra-ui/react';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

const isColorExtreme = (color: string) => {
  const brightness = tinycolor(color).getBrightness() / 2.55;
  return brightness > 98 || brightness < 2;
};

const getBalancedColor = (color: string) => {
  const brightness = tinycolor(color).getBrightness() / 2.55;

  let base = color;
  if (brightness > 98) {
    base = tinycolor(color)
      .darken(5)
      .toHexString();
  }

  if (brightness < 2) {
    base = tinycolor(color)
      .lighten(5)
      .toHexString();
  }

  return base;
};

const calculateShades = (color: string): any => {
  let iterations = 0;

  const optimizeColors = (base: string): any => {
    iterations += 1;
    if (iterations > 10) {
      return;
    }

    if (isColorExtreme(base)) {
      return optimizeColors(getBalancedColor(base));
    }

    const lightnessCoefficient = tinycolor(base).getBrightness() / 2.55;
    const darknessCoefficient = 100 - tinycolor(base).getBrightness() / 2.55;
    const variants = {
      '50': tinycolor(base)
        .lighten(0.6 * darknessCoefficient)
        .toHexString(),
      '100': tinycolor(base)
        .lighten(0.52 * darknessCoefficient)
        .toHexString(),
      '200': tinycolor(base)
        .lighten(0.44 * darknessCoefficient)
        .toHexString(),
      '300': tinycolor(base)
        .lighten(0.3 * darknessCoefficient)
        .toHexString(),
      '400': tinycolor(base)
        .lighten(0.18 * darknessCoefficient)
        .toHexString(),
      '500': color,
      '600': tinycolor(base)
        .darken(0.2 * lightnessCoefficient)
        .toHexString(),
      '700': tinycolor(base)
        .darken(0.35 * lightnessCoefficient)
        .toHexString(),
      '800': tinycolor(base)
        .darken(0.42 * lightnessCoefficient)
        .toHexString(),
      '900': tinycolor(base)
        .darken(0.5 * lightnessCoefficient)
        .toHexString(),
    };

    const extremeVariant = Object.entries(variants)
      .filter(([key]) => key !== '500')
      .find(([_key, value]) => isColorExtreme(value));

    if (extremeVariant) {
      return optimizeColors(getBalancedColor(extremeVariant[1]));
    }

    return variants;
  };

  return optimizeColors(color);
};

export const getChakraTheme = (theme: BlocksTheme): ChakraTheme => {
  return extendTheme({
    colors: {
      primary: calculateShades(theme.colors.primary),
    },
    global: {
      fontFamily:
        "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    },
    fontWeights: {
      hairline: 400,
      thin: 400,
      light: 400,
      normal: 400,
      medium: 400,
      semibold: 500,
      bold: 500,
      extrabold: 500,
      black: 500,
    },
  });
};

// This theme is only used by the styled-system props. Modify config-overrides.js for ant theme changes
const theme = {
  fontSizes: [14, 16, 18, 20, 24, 32, 44, 60],
  colors: {
    primary: '#EF4351',
    secondary: '#07074F',

    danger: '#FF3838',
    success: '#5CB85C',

    heading: {
      light: '#FFFFFF',
      dark: '#070708',
    },
    text: {
      light: '#FAF8F0',
      dark: '#404C4D',
    },
    mutedText: {
      light: '#EEEEEE',
      dark: '#687C94',
    },
    background: {
      light: '#F6F8FF',
      dark: '#17121E',
    },
  },

  radii: [6, 10],
  space: [0, 4, 8, 16, 32, 48, 64, 96],
  baseHeight: [24, 32, 40],
  breakpoints: ['788px', '1128px', '1440px'],
  sizes: ['788px', '1096px', '1440px'],
  lineHeight: 1.5,
};

export default theme;
export type BlocksTheme = typeof theme;
