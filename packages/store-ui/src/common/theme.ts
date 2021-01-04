import { BlocksTheme, DeepPartial } from '@la-mk/blocks-ui/dist/theme';
import tinycolor from 'tinycolor2';

const getOtherColors = (brandColor: string) => {
  const brand = tinycolor(brandColor).toHsl();

  return {
    background: {
      light: tinycolor({ h: brand.h, s: 0.3, l: 0.97 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.92, l: 0.08 }).toHexString(),
    },

    heading: {
      light: tinycolor({ h: brand.h, s: 0.5, l: 0.95 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.92, l: 0.04 }).toHexString(),
    },

    text: {
      light: tinycolor({ h: brand.h, s: 0.2, l: 0.95 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.25, l: 0.35 }).toHexString(),
    },

    mutedText: {
      light: tinycolor({ h: brand.h, s: 0.1, l: 0.85 }).toHexString(),
      dark: tinycolor({ h: brand.h, s: 0.15, l: 0.62 }).toHexString(),
    },
  };
};

const getGenericTheme: DeepPartial<BlocksTheme> & any = (
  brandColor: string,
) => {
  const colors = {
    primary: brandColor,
    success: '#5CB85C',
    danger: '#FF3838',
    ...getOtherColors(brandColor),
  };

  return {
    colors,
    components: {
      Button: {
        baseStyle: {
          fontWeight: 'normal',
        },
      },
      Heading: {
        sizes: {
          '4xl': {
            fontSize: ['6xl', null, '7xl'],
            lineHeight: 1,
          },
          '3xl': {
            fontSize: ['5xl', null, '6xl'],
            lineHeight: 1,
          },
          '2xl': {
            fontSize: ['4xl', null, '5xl'],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ['3xl', null, '4xl'],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ['2xl', null, '3xl'],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: '2xl', lineHeight: 1.2 },
          sm: { fontSize: 'lg', lineHeight: 1.2 },
          xs: { fontSize: 'md', lineHeight: 1.2 },
        },
      },
    },
    sections: {
      Header: {
        height: ['128px', '64px', '64px'],
        logo: {
          position: 'left',
        },
        menu: {
          variant: 'full',
        },
        account: {
          variant: 'solid',
        },
      },
      SubMenu: {
        menu: {
          position: 'left',
        },
      },
      Services: {
        count: 3,
        variant: 'dark',
        decoration: 'icon',
      },
      // TODO: Start using rem's for the card
      ProductCard: {
        badge: {
          position: 'left',
          colors: {
            discounted: colors.danger,
            new: '#D9E93C',
            soldOut: '#043353',
          },
        },
        card: {
          background: 'transparent',
          width: {
            default: [124, 176, 216],
            emphasized: [232, 296, 376],
            horizontal: [316, 460, 560],
          },
        },
        image: {
          width: {
            default: [124, 176, 216],
            emphasized: [232, 296, 376],
            horizontal: [124, 176, 216],
          },
          height: {
            default: [124, 176, 216],
            emphasized: [232, 296, 376],
            horizontal: [124, 176, 216],
          },
        },
        description: {
          heading: {},
        },
      },
      Price: {
        discount: {
          position: 'right',
        },
      },
    },
  };
};

const getFashionTheme: DeepPartial<BlocksTheme> & any = (
  brandColor: string,
) => {
  const colors = {
    primary: brandColor,
    success: '#5CB85C',
    danger: '#BB0439',
    ...getOtherColors(brandColor),
  };

  return {
    colors,
    radii: {
      none: 0,
      sm: 0,
      base: 0,
      md: 0,
      lg: 0,
      xl: 0,
      '2xl': 0,
      '3xl': 0,
      full: 0,
    },

    components: {
      Button: {
        baseStyle: {
          fontWeight: 'normal',
        },
      },
      Heading: {
        sizes: {
          '4xl': {
            fontSize: ['6xl', null, '7xl'],
            lineHeight: 1,
          },
          '3xl': {
            fontSize: ['5xl', null, '6xl'],
            lineHeight: 1,
          },
          '2xl': {
            fontSize: ['4xl', null, '5xl'],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ['3xl', null, '4xl'],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ['2xl', null, '3xl'],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: '2xl', lineHeight: 1.2 },
          sm: { fontSize: 'lg', lineHeight: 1.2 },
          xs: { fontSize: 'md', lineHeight: 1.2 },
        },
      },
    },
    sections: {
      Header: {
        height: '92px',
        logo: {
          position: 'center',
        },
        menu: {
          variant: 'minimal',
        },
        account: {
          variant: 'link',
        },
      },
      SubMenu: {
        menu: {
          position: 'center',
          textTransform: 'uppercase',
        },
      },
      Services: {
        count: 4,
        variant: 'rainbow',
        decoration: 'divider',
        textTransform: 'uppercase',
      },
      ProductCard: {
        badge: {
          position: 'left',
          colors: {
            discounted: colors.danger,
            new: '#D9E93C',
            soldOut: '#043353',
          },
        },
        card: {
          background: colors.background.light,
          width: {
            default: [296, 348, 348],
            emphasized: [320, 480, 796],
          },
        },
        image: {
          width: {
            default: [296, 348, 348],
            emphasized: [320, 480, 796],
          },
          height: {
            default: [380, 448, 448],
            emphasized: [412, 618, 1024],
          },
        },
        description: {
          heading: {
            textTransform: 'uppercase',
          },
        },
      },
      Price: {
        discount: {
          position: 'left',
        },
      },
    },
  };
};

export const getTheme = (brandColor = '#EF4351'): DeepPartial<BlocksTheme> => {
  return getGenericTheme(brandColor);
};
