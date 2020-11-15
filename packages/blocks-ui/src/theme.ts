import tinycolor from 'tinycolor2';
import { createDarkTheme, createTheme } from 'baseui';
import { Theme, ThemePrimitives } from 'baseui/theme';

const customThemeProps = {
  space: ['0', '4px', '8px', '16px', '32px', '48px', '64px', '96px'],
};

export interface InternalBlocksTheme extends Theme {
  space: string[];
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface BlocksTheme {
  primitives: DeepPartial<ThemePrimitives>;
  overrides?: DeepPartial<Theme>;
  type?: 'dark' | 'light';
}

// The second parameter (overrides) is for specific components.
export const getTheme = (
  theme: BlocksTheme = { primitives: {} }
): InternalBlocksTheme => {
  let baseTheme;
  if (theme.type === 'dark') {
    baseTheme = createDarkTheme(theme.primitives, theme.overrides);
  }
  baseTheme = createTheme(theme.primitives, theme.overrides);

  return { ...baseTheme, ...customThemeProps };
};

// const getOtherColors = (brandColor: string) => {
//   const brand = tinycolor(brandColor).toHsl();

//   return {
//     background: {
//       light: tinycolor({ h: brand.h, s: 0.3, l: 0.97 }).toHexString(),
//       dark: tinycolor({ h: brand.h, s: 0.92, l: 0.08 }).toHexString(),
//     },

// Calculation copied from https://github.com/mbitson/mcg/blob/master/scripts/controllers/ColorGeneratorCtrl.js
const calculateShades = (color: string, pre: string) => {
  return {
    [pre]: color,
    [`${pre}50`]: tinycolor(color)
      .lighten(46)
      .toHexString(),
    [`${pre}100`]: tinycolor(color)
      .lighten(32)
      .toHexString(),
    [`${pre}200`]: tinycolor(color)
      .lighten(18)
      .toHexString(),
    [`${pre}300`]: tinycolor(color)
      .lighten(8)
      .toHexString(),
    [`${pre}400`]: color,
    [`${pre}500`]: tinycolor(color)
      .darken(8)
      .toHexString(),
    [`${pre}600`]: tinycolor(color)
      .darken(18)
      .toHexString(),
    [`${pre}700`]: tinycolor(color)
      .darken(28)
      .toHexString(),
  };
};

export const getBrandTheme = (
  brandColor = '#EF4351',
  overrides?: DeepPartial<Theme>
): BlocksTheme => {
  const isLight = tinycolor(brandColor).isLight();

  return {
    primitives: {
      ...calculateShades(brandColor, 'primary'),
      ...calculateShades('#276EF1', 'accent'),
      ...calculateShades('#05944F', 'positive'),
      ...calculateShades('#FFC043', 'warning'),
      ...calculateShades('#E11900', 'negative'),
      primaryFontFamily: 'Ubuntu',
    },
    overrides: {
      ...overrides,
      breakpoints: { small: 788, medium: 1128, large: 1440 },
      sizing: {
        scale0: '2px',
        scale100: '4px',
        scale200: '6px',
        scale300: '6px',
        scale400: '8px',
        scale500: '8px',
        scale550: '10px',
        scale600: '12px',
        scale700: '14px',
        scale750: '18px',
        scale800: '22px',
        scale850: '26px',
        scale900: '32px',
        scale950: '36px',
        scale1000: '40px',
        scale1200: '48px',
        scale1400: '56px',
        scale1600: '64px',
        scale2400: '96px',
        scale3200: '128px',
        scale4800: '192px',
      },
      colors: {
        contentPrimary: 'black',
        buttonMinimalText: 'black',
        buttonTertiaryText: 'black',
      },
    },
    type: isLight ? 'light' : 'dark',
  };
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
export type OldBlocksTheme = typeof theme;
