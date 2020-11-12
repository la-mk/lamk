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
    overrides: overrides,
    type: isLight ? 'light' : 'dark',
  };
};
