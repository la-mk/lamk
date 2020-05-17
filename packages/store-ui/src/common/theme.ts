export const getTheme = (brandColor: string) => {
  return {
    colors: {
      primary: brandColor,
      background: {
        light: '#EFF4FB',
        dark: '#043353',
      },
      text: {
        dark: '#043353',
        light: '#F8F8F8',
      },
      mutedText: {
        light: '#D3DDE6',
      },
    },
  };
};
