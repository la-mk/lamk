import styled from "@emotion/styled";
import { Box, Flex, Tabs } from "@la-mk/blocks-ui";
import { FinalBlocksTheme } from "@la-mk/blocks-ui/dist/theme";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { AccountLayoutProps } from "../../../containers/account/Layout";
import { useAuth } from "../../../hooks/useAuth";
import { urls } from "../../../tooling/url";

const tabs = [
  urls.accountPersonal,
  urls.accountChangePassword,
  urls.accountAddresses,
  urls.accountOrders,
  urls.home,
];

const TabsWrapper = styled.div`
  .chakra-tabs__tablist {
    overflow-y: auto;
    border: none;
    background: ${(props: { theme: FinalBlocksTheme }) =>
      props.theme.colors.gray["200"]};

    button {
      white-space: nowrap;
      padding: 12px;
    }

    button[aria-selected="true"] {
      background: ${(props: { theme: FinalBlocksTheme }) =>
        props.theme.colors.gray["600"]};
      color: white;
    }
  }
`;

export const Layout = ({ children }: AccountLayoutProps) => {
  const { pathname, push, replace } = useRouter();
  const { logout } = useAuth();
  const { t } = useTranslation("translation");
  const currentIndex = tabs.findIndex((x) => pathname.startsWith(x));
  const content = <Box mt={5}>{children}</Box>;

  return currentIndex >= 0 ? (
    <TabsWrapper theme={undefined!}>
      <Tabs
        // @ts-ignore
        isLazy
        // @ts-ignore
        isFitted
        // Needed so onChange doesnt fire twice.
        // @ts-ignore
        isManual
        mb={6}
        onChange={async (idx) => {
          if (tabs[idx] === urls.home) {
            try {
              await replace(tabs[idx]);
              logout();
            } catch (err) {}
          } else {
            push(tabs[idx]);
          }
        }}
        index={currentIndex}
        items={[
          {
            title: t("pages.personalDetails"),
            content,
          },
          {
            title: t("pages.changePassword"),
            content,
          },
          {
            title: t("pages.myAddresses"),
            content,
          },
          {
            title: t("pages.myOrders"),
            content,
          },
          {
            title: t("auth.logout"),
            content,
          },
        ]}
      />
    </TabsWrapper>
  ) : (
    content
  );
};
