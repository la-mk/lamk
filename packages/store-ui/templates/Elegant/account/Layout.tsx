import styled from "@emotion/styled";
import { Box, Tabs } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { AccountLayoutProps } from "../../../containers/account/Layout";
import { urls } from "../../../tooling/url";

const tabs = [
  urls.accountPersonal,
  urls.accountChangePassword,
  urls.accountAddresses,
  urls.accountOrders,
];

const TabsWrapper = styled.div`
  .chakra-tabs__tablist {
    -overflow-y: auto;
  }
`;

export const Layout = ({ children }: AccountLayoutProps) => {
  const { pathname, push } = useRouter();
  const { t } = useTranslation("translation");
  const currentIndex = tabs.findIndex((x) => pathname.startsWith(x)) ?? 0;
  const content = <Box mt={5}>{children}</Box>;

  return (
    <TabsWrapper>
      <Tabs
        // @ts-ignore
        isLazy
        // @ts-ignore
        isFitted
        mt={6}
        mb={6}
        onChange={(idx) => {
          push(tabs[idx]);
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
        ]}
      />
    </TabsWrapper>
  );
};
