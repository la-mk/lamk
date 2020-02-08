export interface BlocksTheme {
  space: number[];
  breakpoints: string[];
}

// This theme is only used by the styled-system props. Modify config-overrides.js for ant theme changes
export default {
  space: [0, 4, 8, 16, 32, 48, 64],
  breakpoints: ['476px', '728px', '952px', '1280px'],
  sizes: ['476px', '728px', '952px', '1280px'],
} as BlocksTheme;
