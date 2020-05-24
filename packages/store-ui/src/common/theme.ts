export const getTheme = (brandColor: string) => {
  return {
    colors: {
      primary: brandColor,

      success: '#5CB85C',

      background: {
        light: '#EFF4FB',
        dark: '#043353',
      },
      heading: {
        dark: '#043353',
        light: '#F8F8F8',
      },
      text: {
        dark: '#687C94',
        light: '#F8F8F8',
      },
      mutedText: {
        light: '#D3DDE6',
      },
    },
  };
};
