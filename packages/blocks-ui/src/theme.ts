export interface BlocksTheme {
  space: number[];
  breakpoints: string[];
}

// This theme is only used by the styled-system props. Modify config-overrides.js for ant theme changes
export default {
  space: [0, 4, 8, 16, 32, 48, 64],
  breakpoints: ['788px', '1128px', '1440px'],
  sizes: ['788px', '1096px', '1440px'],
  colors: {
    primary: '#687C94',
    secondary: '#F6376D',
  }
} as BlocksTheme;
