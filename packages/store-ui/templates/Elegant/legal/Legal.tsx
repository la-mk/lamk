import React from "react";
import { Flex, Box, Text } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
// import { Page } from "../../layout/Page";
import { urls } from "../../../tooling/url";
import { ClickableCard } from "../../../components/ClickableCard";
import { Page } from "../Page";
// import { Breadcrumbs } from "../../components/Breadcrumbs";

export const Legal = () => {
  const { t } = useTranslation("translation");

  const submenus = [
    {
      link: urls.generalRules,
      text: t("pages.generalRules"),
    },
    {
      link: urls.termsOfUse,
      text: t("pages.termsOfUse"),
    },
    {
      link: urls.returnsAndRefunds,
      text: t("pages.returnAndRefund"),
    },
    {
      link: urls.privacyPolicy,
      text: t("pages.privacy"),
    },
    {
      link: urls.cookiesPolicy,
      text: t("pages.cookiesPolicy"),
    },
  ];

  return (
    <>
      {/* <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.legal, title: t("pages.legal") },
        ]}
      /> */}
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
    </>
  );
};
