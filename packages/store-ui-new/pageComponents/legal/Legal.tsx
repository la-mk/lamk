import React from "react";
import { Flex, Box, Text } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { ClickableCard } from "../../components/ClickableCard";
import { Page } from "../../layout/Page";

export const Legal = () => {
  const { t } = useTranslation("translation");
  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/legal", title: t("pages.legal") },
  ]);

  const submenus = [
    {
      link: "/legal/general-rules",
      text: t("pages.generalRules"),
    },
    {
      link: "/legal/terms-of-use",
      text: t("pages.termsOfUse"),
    },
    {
      link: "/legal/return-and-refund",
      text: t("pages.returnAndRefund"),
    },
    {
      link: "/legal/privacy",
      text: t("pages.privacy"),
    },
    {
      link: "/legal/cookies-policy",
      text: t("pages.cookiesPolicy"),
    },
  ];

  return (
    <Page maxWidth={"86rem"} title={t("pages.legal")}>
      <Text as="p" align="center">
        {t("legal.legalExplanation")}
      </Text>

      <Flex mt={6} align="center" justify="center" wrap="wrap">
        {submenus.map((submenu) => {
          return (
            <Box key={submenu.link} m={3}>
              <ClickableCard title={submenu.text} href={submenu.link} />
            </Box>
          );
        })}
      </Flex>
    </Page>
  );
};
