import React, { useMemo } from "react";
import { Provider } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { BlocksTheme, DeepPartial } from "@la-mk/blocks-ui/dist/theme";
import tinycolor from "tinycolor2";
import { Templates } from "../containers";

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
  brandColor: string
) => {
  const colors = {
    primary: brandColor,
    success: "#5CB85C",
    danger: "#FF3838",
    ...getOtherColors(brandColor),
  };

  return {
    colors,
    components: {
      Button: {
        baseStyle: {
          fontWeight: "normal",
        },
      },
      Menu: {
        baseStyle: {
          list: {
            zIndex: 5,
          },
        },
      },
      Heading: {
        sizes: {
          "4xl": {
            fontSize: ["6xl", null, "7xl"],
            lineHeight: 1,
          },
          "3xl": {
            fontSize: ["5xl", null, "6xl"],
            lineHeight: 1,
          },
          "2xl": {
            fontSize: ["4xl", null, "5xl"],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ["3xl", null, "4xl"],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ["2xl", null, "3xl"],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: "2xl", lineHeight: 1.2 },
          sm: { fontSize: "lg", lineHeight: 1.2 },
          xs: { fontSize: "md", lineHeight: 1.2 },
        },
      },
    },
    sections: {
      Header: {
        height: ["128px", "64px", "64px"],
        logo: {
          position: "left",
        },
        menu: {
          variant: "full",
        },
        account: {
          variant: "solid",
        },
      },
      SubMenu: {
        menu: {
          position: "left",
          spacing: "small",
        },
      },
      Home: {
        banner: {
          variant: "minimal",
        },
      },
      Categories: {
        layout: "grid",
        variant: "illustrated",
        count: 3,
      },
      Services: {
        count: 3,
        variant: "dark",
        decoration: "icon",
      },
      Sets: {
        heading: {
          variant: "plain",
        },
      },
      // TODO: Start using rem's for the card
      ProductCard: {
        badge: {
          position: "right",
          colors: {
            discounted: colors.danger,
            new: "#D9E93C",
            soldOut: "#043353",
          },
        },
        card: {
          background: "transparent",
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
          position: "right",
        },
      },
    },
  };
};

const getFashionTheme: DeepPartial<BlocksTheme> & any = (
  brandColor: string
) => {
  const colors = {
    primary: brandColor,
    success: "#5CB85C",
    danger: "#BB0439",
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
      "2xl": 0,
      "3xl": 0,
      full: 0,
    },

    components: {
      Button: {
        baseStyle: {
          fontWeight: "normal",
        },
      },
      Menu: {
        baseStyle: {
          list: {
            zIndex: 5,
          },
        },
      },
      Heading: {
        sizes: {
          "4xl": {
            fontSize: ["6xl", null, "7xl"],
            lineHeight: 1,
          },
          "3xl": {
            fontSize: ["5xl", null, "6xl"],
            lineHeight: 1,
          },
          "2xl": {
            fontSize: ["4xl", null, "5xl"],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ["3xl", null, "4xl"],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ["2xl", null, "3xl"],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: "2xl", lineHeight: 1.2 },
          sm: { fontSize: "lg", lineHeight: 1.2 },
          xs: { fontSize: "md", lineHeight: 1.2 },
        },
      },
    },
    sections: {
      SubMenu: {
        menu: {
          position: "center",
          textTransform: "uppercase",
          spacing: "large",
        },
      },
      Home: {
        banner: {
          variant: "bold",
        },
      },
      Categories: {
        layout: "masonry",
        variant: "bold",
        count: 4,
      },
      Services: {
        count: 4,
        variant: "rainbow",
        decoration: "divider",
        textTransform: "uppercase",
      },
      Sets: {
        heading: { variant: "decorated" },
      },
      ProductCard: {
        badge: {
          position: "left",
          colors: {
            discounted: colors.danger,
            new: "#D9E93C",
            soldOut: "#043353",
          },
        },
        card: {
          background: colors.background.light,
          width: {
            default: [296, 348, 348],
            emphasized: [320, 496, 496],
          },
        },
        image: {
          width: {
            default: [296, 348, 348],
            emphasized: [320, 496, 496],
          },
          height: {
            default: [380, 448, 448],
            emphasized: [412, 640, 640],
          },
        },
        description: {
          heading: {
            textTransform: "uppercase",
          },
        },
      },
      Price: {
        discount: {
          position: "left",
        },
      },
    },
  };
};

const getElegantTheme: DeepPartial<BlocksTheme> & any = (
  brandColor: string
) => {
  const colors = {
    primary: brandColor,
    success: "#5CB85C",
    danger: "#BB0439",
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
      "2xl": 0,
      "3xl": 0,
      full: 0,
    },

    components: {
      Button: {
        baseStyle: {
          fontWeight: "normal",
        },
        variants: {
          link: {
            textDecoration: "underline",
          },
        },
      },
      Menu: {
        baseStyle: {
          list: {
            zIndex: 5,
          },
        },
      },
      Heading: {
        sizes: {
          "4xl": {
            fontSize: ["6xl", null, "7xl"],
            lineHeight: 1,
          },
          "3xl": {
            fontSize: ["5xl", null, "6xl"],
            lineHeight: 1,
          },
          "2xl": {
            fontSize: ["4xl", null, "5xl"],
            lineHeight: [1.2, null, 1],
          },
          xl: {
            fontSize: ["3xl", null, "4xl"],
            lineHeight: [1.33, null, 1.2],
          },
          lg: {
            fontSize: ["2xl", null, "3xl"],
            lineHeight: [1.33, null, 1.2],
          },
          md: { fontSize: "2xl", lineHeight: 1.2 },
          sm: { fontSize: "lg", lineHeight: 1.2 },
          xs: { fontSize: "md", lineHeight: 1.2 },
        },
      },
    },
  };
};

const getTheme = (
  brandColor = "#EF4351",
  template: Templates = "standard"
): DeepPartial<BlocksTheme> => {
  switch (template) {
    case "standard":
      return getGenericTheme(brandColor);
    case "elegant":
      return getElegantTheme(brandColor);
  }
  // return getFashionTheme(brandColor);
};

const getTranslations = (t: (key: string) => string) => {
  return {
    firstName: t("common.firstName"),
    lastName: t("common.lastName"),
    phoneNumber: t("common.phoneNumber"),
    email: t("common.email"),
    password: t("common.password"),
    currentPassword: t("common.currentPassword"),
    newPassword: t("common.newPassword"),
    forgotPassword: t("auth.forgotPassword"),
    forgotPasswordExplanation: t("auth.forgotPasswordExplanation"),
    resetPassword: t("auth.resetPassword"),
    resetPasswordExplanation: t("auth.resetPasswordExplanation"),
    sendPasswordResetLink: t("actions.sendPasswordResetLink"),
    loginInstead: t("actions.loginInstead"),
    forgotPasswordSuccess: t("auth.forgotPasswordSuccess"),
    forgotPasswordSuccessExplanation: t(
      "auth.forgotPasswordSuccessExplanation"
    ),
    signup: t("auth.signup"),
    login: t("auth.login"),
    or: t("common.or"),
    authSameAccount: t("auth.authSameAccount"),
    update: t("actions.update"),
    registerConfirmTermsOfService: t("auth.registerConfirmTermsOfService"),
    termsOfService: t("auth.termsOfService"),
    collectAccountInfoReviewPolicy: t("auth.collectAccountInfoReviewPolicy"),
    privacyPolicy: t("auth.privacyPolicy"),
    cookiesPolicy: t("pages.cookiesPolicy").toLowerCase(),
    acceptAll: t("actions.acceptAll"),
    acceptSelected: t("actions.acceptSelected"),
    forMoreDetails: t("auth.forMoreDetails"),
    cookiesExplanation: t("auth.cookiesExplanation"),
    readMoreCookies: t("auth.readMoreCookies"),
    decline: t("actions.declineOptional"),
  };
};

export const ThemeProvider = ({
  children,
  brandColor,
  template,
}: {
  brandColor: string;
  template: Templates;
  children: React.ReactElement;
}) => {
  const { t } = useTranslation("translation");
  const translations = useMemo(() => getTranslations(t), [t]);
  const theme = useMemo(
    () => getTheme(brandColor, template),
    [brandColor, template]
  );

  return (
    <Provider theme={theme} translations={translations}>
      {children}
    </Provider>
  );
};
