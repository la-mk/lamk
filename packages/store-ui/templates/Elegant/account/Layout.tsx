import styled from "@emotion/styled";
import { Box, Button, Flex } from "@la-mk/blocks-ui";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { TFunction, useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "@chakra-ui/react";
import React from "react";
import { AccountLayoutProps } from "../../../containers/account/Layout";
import { useAuth } from "../../../hooks/useAuth";
import { urls } from "../../../tooling/url";

const getTabs = (t: TFunction) => [
  { href: urls.accountOrders, title: t("pages.myOrders") },
  { href: urls.accountAddresses, title: t("pages.myAddresses") },
  { href: urls.accountPersonal, title: t("pages.personalDetails") },
  { href: urls.accountChangePassword, title: t("pages.changePassword") },
  { href: urls.home, title: t("auth.logout") },
];

const TabsWrapper = styled(Flex)<{
  currentIndex: number;
  theme: FinalBlocksTheme;
}>`
  & {
    overflow-y: auto;

    a {
      white-space: nowrap;
      padding: 12px;
      color: black;
      background: ${(props) => props.theme.colors.gray["200"]};
      :focus,
      :hover {
        background: ${(props) => props.theme.colors.gray["600"]};
        color: white;
      }
    }
  }
`;

export const Layout = ({ children }: AccountLayoutProps) => {
  const { pathname, replace } = useRouter();
  const { logout } = useAuth();
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const tabs = getTabs(t);
  const currentIndex = tabs.findIndex(
    (x) => pathname.startsWith(x.href) && !pathname.includes("pay")
  );

  const handleOnClick = async (href: string) => {
    if (href === urls.home) {
      try {
        await replace(urls.home);
        logout();
      } catch (err) {}
    }
  };

  return (
    <>
      {currentIndex >= 0 && (
        <TabsWrapper
          theme={undefined!}
          currentIndex={currentIndex}
          direction="row"
        >
          {tabs.map((tab, idx) => {
            const isCurrent = currentIndex === idx;
            return (
              <Box key={tab.href} flex={1}>
                <Link passHref replace href={tab.href}>
                  <Button
                    // @ts-ignore
                    style={
                      isCurrent
                        ? {
                            background: theme.colors.gray["600"],
                            color: "white",
                          }
                        : undefined
                    }
                    onClick={() => handleOnClick(tab.href)}
                    isFullWidth
                    as="a"
                    size="lg"
                  >
                    {tab.title}
                  </Button>
                </Link>
              </Box>
            );
          })}
        </TabsWrapper>
      )}
      <Box mb={6} mt={7}>
        {children}
      </Box>
    </>
  );
};
