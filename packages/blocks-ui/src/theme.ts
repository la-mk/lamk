
// This theme is only used by the styled-system props. Modify config-overrides.js for ant theme changes
const theme = {
  fontSizes: [14, 16, 18, 20, 24, 32, 44, 60],
  colors: {
    primary: '#F6376D',
    secondary: '#687C94',
    tertiary: '#DEEAF8',

    heading: {
      light: '#ffffff',
      dark: '#263135',
    },
    text: {
      light: '#FAF8F0',
      dark: '#727782',
    },
    mutedText: {
      light: '#EEEEEE',
      dark: '#687C94',
    },
    background: {
      light: '#F6F8FC',
      dark: '#263135',
    },
  },
  space: [0, 4, 8, 16, 32, 48, 64],
  breakpoints: ['788px', '1128px', '1440px'],
  sizes: ['788px', '1096px', '1440px'],
};

export default theme;
export type BlocksTheme = typeof theme;
