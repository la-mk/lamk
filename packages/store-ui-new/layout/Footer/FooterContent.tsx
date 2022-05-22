import React from "react";
import {
  Flex,
  Box,
  Divider,
  FooterContent as BaseFooterContent,
} from "@la-mk/blocks-ui";
import { Menu } from "@la-mk/blocks-ui/dist/compound/FooterContent";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { StoreFooterSection } from "./StoreFooterSection";
import { SubFooter } from "./SubFooter";
import { Store } from "../../domain/store";
import { urls } from "../../tooling/url";

const getMenus = (t: any): Menu[] => [
  {
    text: t("common.ourCompany"),
    link: urls.home,

    submenus: [
      {
        link: urls.about,
        text: t("pages.aboutUs"),
      },
      {
        link: urls.products,
        text: t("pages.product_plural"),
      },
      {
        link: urls.accountPersonal,
        text: t("pages.myAccount"),
      },
      {
        link: urls.accountOrders,
        text: t("pages.myOrders"),
      },
      {
        link: "https://la.mk/blog/get-started-using-store",
        text: t("pages.usageInstructions"),
      },
    ],
  },
  {
    text: t("pages.legal"),
    link: urls.legal,
    submenus: [
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
    ],
  },
];

export const FooterContent = ({
  store,
}: {
  store: Pick<Store, "logo" | "contact" | "_id">;
}) => {
  const { t } = useTranslation("translation");

  return (
    <Box py={2}>
      <Flex
        maxWidth={"68rem"}
        px={[3, 4, 6]}
        pt={[4, 5, 6]}
        mx="auto"
        direction={["column", "column", "row"]}
        align={["center", "center", "flex-start"]}
        justify={"space-between"}
        color="text.light"
      >
        <Box mr={[0, 0, 5]}>
          <StoreFooterSection store={store} />
        </Box>
        <BaseFooterContent menus={getMenus(t)} Link={Link} />
      </Flex>

      <Divider display={["none", "none", "block"]} mb={4} mt={6} />

      <SubFooter />
    </Box>
  );
};
