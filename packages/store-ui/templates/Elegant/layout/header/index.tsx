import {
  Badge,
  Box,
  Flex,
  hooks,
  Image,
  Positioner,
  Text,
} from "@la-mk/blocks-ui";
import Link from "next/link";
import { ShoppingCart, User } from "react-feather";
import React from "react";
import { getImageURL } from "../../../../hacks/imageUrl";
import { urls } from "../../../../tooling/url";
import { useTranslation } from "next-i18next";
import { NavButton } from "./NavButton";
import { MobileMenu } from "./MobileMenu";
import { HeaderProps } from "../../../../containers/layout/Header";

const Logo = ({
  getLogoUrl,
  height,
}: {
  getLogoUrl: (params: any) => string | null;
  height: string;
}) => {
  const size = [
    `calc(${height} - 48px)`,
    `calc(${height} - 42px)`,
    `calc(${height} - 32px)`,
  ];

  return (
    <Link href={urls.home} passHref>
      <Box as="a" lineHeight={0}>
        <Box height={size} minWidth={size} m={1}>
          <Image getSrc={getLogoUrl} height={parseInt(height)} alt="logo" />
        </Box>
      </Box>
    </Link>
  );
};

const menus = [
  {
    title: "Shop all",
    href: urls.products,
  },
  {
    title: "Discounted",
    href: urls.products,
  },
  {
    title: "Serial",
    href: urls.products,
  },
  {
    title: "Elegance",
    href: urls.products,
  },
  {
    title: "Gifts",
    href: urls.products,
  },
];

const headerHeight = ["64px", "72px", "82px"];

export const Header = ({ store, cartCount }: HeaderProps) => {
  const { t } = useTranslation("translation");
  return (
    <>
      <Flex bg="black" py={3} px={6} align="center" justify="center">
        <Text size="sm" align={"center"} as="strong" color="white">
          Order now and get free shipping on all orders over 3000 ден.
        </Text>
      </Flex>
      <Flex
        height={headerHeight}
        direction="row"
        justify="space-between"
        align="center"
        px={[4, 6, 7]}
        // @ts-ignore
        border="1px solid #e8e8e8"
      >
        <Flex width={"100px"} display={["flex", "none", "none"]}>
          <MobileMenu menus={menus} />
        </Flex>

        <Flex>
          <Logo
            getLogoUrl={(params) =>
              getImageURL(store.logo?._id ?? "", store._id, params)
            }
            height={"82px"}
          />
        </Flex>

        <Flex align="center">
          <Flex display={["none", "flex", "flex"]}>
            {menus.map((x) => (
              <Flex
                key={x.title}
                align={"center"}
                justify="center"
                mx={[4, 4, 5]}
              >
                <NavButton href={x.href} title={x.title} />
              </Flex>
            ))}
          </Flex>

          <Link passHref href={urls.account}>
            <Box mx={[4, 4, 5]}>
              <User style={{ cursor: "pointer" }} size="1.5rem" />
            </Box>
          </Link>

          <Link passHref href={urls.cart}>
            <Positioner
              overlayContent={
                cartCount > 0 ? (
                  <Badge
                    variant="solid"
                    colorScheme="red"
                    borderRadius="100%"
                    // @ts-ignore
                    height="8px"
                    width="8px"
                  ></Badge>
                ) : undefined
              }
            >
              <ShoppingCart style={{ cursor: "pointer" }} size="1.5rem" />
            </Positioner>
          </Link>
        </Flex>
      </Flex>
    </>
  );
};
