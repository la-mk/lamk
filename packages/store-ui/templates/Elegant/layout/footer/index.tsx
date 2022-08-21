import React from "react";
import { Flex, Box, Button, Text, Heading } from "@la-mk/blocks-ui";
import { Menu } from "@la-mk/blocks-ui/dist/compound/FooterContent";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { StoreFooterSection } from "./StoreFooterSection";
import { SubFooter } from "./SubFooter";
import { Store } from "../../../../domain/store";
import { urls } from "../../../../tooling/url";

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
];

const Submenu = ({ submenus }: { submenus: Menu["submenus"] }) => {
  return (
    <Flex width="100%" direction="column" align="flex-start">
      {submenus.map((submenu) => {
        return (
          <Link key={submenu.link} href={submenu.link} passHref>
            <Button as="a" my={2} variant="link">
              <Text size="sm" color="mutedText.light">
                {submenu.text}
              </Text>
            </Button>
          </Link>
        );
      })}
    </Flex>
  );
};

const SubmenuTitle = ({ menu, Link }: { menu: Menu; Link: any }) => {
  const title = (
    <Heading mb={4} size="sm" color="mutedText.dark" as="h4">
      {menu.text.toUpperCase()}
    </Heading>
  );

  return (
    <>
      {menu.link && (
        <Link key={menu.link} href={menu.link}>
          <a style={{ textDecoration: "none" }}>{title}</a>
        </Link>
      )}
      {!menu.link && title}
    </>
  );
};

export const Footer = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");

  return (
    <Box pt={[7, 8, 8]} px={[4, 7, 8]} bg="background.dark">
      <Box py={2}>
        <Flex
          mb={[6, 8, 9]}
          pt={[4, 5, 6]}
          mx="auto"
          direction={["column", "column", "row"]}
          align={["center", "center", "flex-start"]}
          justify={"space-between"}
          color="text.light"
        >
          <Box flex={1} mr={[0, 0, 5]}>
            <StoreFooterSection store={store} />
          </Box>

          <Flex mt={[7, 7, 0]} flex={1}>
            {getMenus(t).map((menu) => {
              return (
                <Flex direction="column" align="center" key={menu.text} mx={4}>
                  <SubmenuTitle Link={Link} menu={menu} />
                  <Submenu submenus={menu.submenus} />
                </Flex>
              );
            })}
          </Flex>
          <Box mt={[7, 7, 0]} flex={1} textAlign="center">
            <Heading
              textTransform={"uppercase"}
              mb={4}
              size="sm"
              color="mutedText.dark"
              as="h4"
            >
              Are you a business?
            </Heading>
            <Text color="mutedText.light">
              If you are a business that wants to provide branded products to
              your employees, we are here to help! We offer discounts and
              customized products for bulk orders. Reach out to us for
              quotations and more details.
            </Text>
          </Box>
        </Flex>

        <SubFooter store={store} />
      </Box>
    </Box>
  );
};
