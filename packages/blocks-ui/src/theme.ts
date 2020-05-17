
// This theme is only used by the styled-system props. Modify config-overrides.js for ant theme changes
const theme = {
  fontSizes: [14, 16, 18, 20, 24, 32, 44, 60],
  colors: {
    primary: '#EF4351',
    secondary: '#687C94',
    tertiary: '#DEEAF8',
    
    danger: '#FF3838',

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
  radii: [4, 6],
  space: [0, 4, 8, 16, 32, 48, 64, 96],
  breakpoints: ['788px', '1128px', '1440px'],
  sizes: ['788px', '1096px', '1440px'],
  lineHeight: 1.5,
};

export default theme;
export type BlocksTheme = typeof theme;
