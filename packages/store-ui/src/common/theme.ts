export const getTheme = (brandColor: string) => {
  return {
    colors: {
      primary: brandColor,

      success: '#5CB85C',

      background: {
        light: '#F5F8FD',
        dark: '#043353',
      },
      heading: {
        dark: '#043353',
        light: '#F8F8F8',
      },
      text: {
        dark: '#505F65',
        light: '#F8F8F8',
      },
      mutedText: {
        light: '#D3DDE6',
        dark: '#8e9cad',
      },
    },
  };
};
