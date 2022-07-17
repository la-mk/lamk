import { Badge, Box, Flex, hooks, Image, Positioner } from "@la-mk/blocks-ui";
import Link from "next/link";
import { ShoppingCart, User } from "react-feather";
import React from "react";
import { HeaderProps } from "..";
import { getImageURL } from "../../../hacks/imageUrl";
import { urls } from "../../../tooling/url";
import { useTranslation } from "next-i18next";
import { NavButton } from "./NavButton";
import { MobileMenu } from "./MobileMenu";

const Logo = ({
  getLogoUrl,
  height,
}: {
  getLogoUrl: (params: any) => string | null;
  height: string;
}) => (
  <Link href={urls.home} passHref>
    <Box as="a" lineHeight={0}>
      <Box
        height={`calc(${height} - 8px)`}
        minWidth={`calc(${height} - 8px)`}
        m={1}
      >
        <Image getSrc={getLogoUrl} height={parseInt(height)} alt="logo" />
      </Box>
    </Box>
  </Link>
);

const menus = [
  {
    title: "Shop all",
  },
  {
    title: "Discounted",
  },
  {
    title: "Serial",
  },
  {
    title: "Elegance",
  },
  {
    title: "Gifts",
  },
];

const headerHeight = ["50px", "64px", "74px"];
export const Header = ({ store, cartCount, searchValue }: HeaderProps) => {
  const { t } = useTranslation("translation");
  const imageHeight = hooks.useBreakpoint(headerHeight);

  return (
    <Flex
      height={headerHeight}
      direction="row"
      justify="space-between"
      align="center"
      px={[4, 6, 7]}
    >
      <Flex display={["flex", "none", "none"]}>
        <MobileMenu menus={menus} />
      </Flex>

      <Flex>
        <Logo
          getLogoUrl={(params) =>
            getImageURL(store.logo?._id ?? "", store._id, params)
          }
          height={imageHeight}
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
              <NavButton title={x.title} />
            </Flex>
          ))}
        </Flex>

        <Link passHref href={urls.account}>
          <User size="1.5rem" />
        </Link>

        <Link passHref href={urls.cart}>
          <Positioner
            overlayContent={
              cartCount > 0 ? (
                <Badge
                  variant="solid"
                  colorScheme="primary"
                  borderRadius="full"
                  size="sm"
                  py={"1px"}
                >
                  {cartCount ?? 0}
                </Badge>
              ) : undefined
            }
          >
            <ShoppingCart size="1.5rem" />
          </Positioner>
        </Link>
      </Flex>
    </Flex>
  );
};
