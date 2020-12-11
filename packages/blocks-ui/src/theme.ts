import tinycolor from 'tinycolor2';
import { extendTheme, Theme as ChakraTheme } from '@chakra-ui/react';
import merge from 'lodash/merge';

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
  // @ts-ignore
  return extendTheme({
    // @ts-ignore
    colors: {
      ...merge(theme.colors, {
        secondary: '#07074F',

        danger: '#FF3838',
        success: '#5CB85C',

        heading: {
          // @ts-ignore
          light: '#FFFFFF',
          dark: '#070708',
        },
        text: {
          // @ts-ignore
          light: '#FAF8F0',
          dark: '#404C4D',
        },
        mutedText: {
          // @ts-ignore
          light: '#EEEEEE',
          dark: '#687C94',
        },
        background: {
          // @ts-ignore
          light: '#F6F8FF',
          dark: '#17121E',
        },
      }),
      primary: calculateShades(theme.colors?.primary ?? '#EF4351'),
    },
    global: {
      fontFamily:
        "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
    },
    space: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.5rem',
      6: '2rem',
      7: '3rem',
      8: '5rem',
      9: '8rem',
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

export interface BlocksTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    danger?: string;
    success?: string;

    background?: {
      light?: string;
      dark?: string;
    };

    heading?: {
      light?: string;
      dark?: string;
    };

    text?: {
      light?: string;
      dark?: string;
    };

    mutedText?: {
      light?: string;
      dark?: string;
    };
  };
}
