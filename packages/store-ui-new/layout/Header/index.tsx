import React, { useContext } from "react";
import {
  Badge,
  Positioner,
  Box,
  Flex,
  Input,
  Image,
  hooks,
} from "@la-mk/blocks-ui";
import Link from "next/link";
import { ShoppingBag, ShoppingCart, Search, Briefcase } from "react-feather";
import { useTheme } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { NavButton } from "./NavButton";
import { AccountMenu } from "./AccountMenu";
import { Store } from "../../domain/store";
import { filterRouter, getSearchHref, urls } from "../../tooling/url";
import { getImageURL } from "../../hacks/imageUrl";
import { Contact } from "../../components/Contact";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  store: Pick<Store, "contact" | "logo" | "_id">;
  cartCount: number;
  searchValue?: string;
}

export const Header = ({ store, cartCount, searchValue }: HeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation("translation");
  const theme = useTheme();
  const { login, logout, user } = useAuth();

  const ownTheme = theme.sections.Header;
  const desktopHeight = Array.isArray(ownTheme.height)
    ? ownTheme.height[ownTheme.height.length - 1]
    : ownTheme.height;

  const [filters] = hooks.useFilter(
    {},
    {
      storage: "url",
      router: filterRouter,
    }
  );
  const [searchVal, setSearchVal] = React.useState(filters.searching);
  React.useEffect(() => {
    setSearchVal(searchValue ?? "");
  }, [searchValue]);

  const presetSearch = (
    <Flex
      height={`calc(${desktopHeight} - 0.5rem)`}
      width="100%"
      align="center"
      justify="center"
    >
      <Input
        type="search"
        size="lg"
        value={searchVal}
        onChange={(_e, val: unknown) => setSearchVal(val as string)}
        onSearch={(val) => {
          // We don't want to preserve the existing parameters for now, see if this would be an issue.
          const productsUrl = getSearchHref(val);
          router.push(productsUrl);
        }}
        placeholder={t("actions.search")}
      />
    </Flex>
  );

  const logo = (
    <Link href={urls.home} passHref>
      <Box as="a" lineHeight={0}>
        <Box
          height={`calc(${desktopHeight} - 0.5rem)`}
          minWidth={`calc(${desktopHeight} - 0.5rem)`}
          m={1}
        >
          <Image
            getSrc={(params) =>
              getImageURL(store.logo?._id ?? "", store._id, params)
            }
            height={parseInt(desktopHeight)}
            alt="logo"
          />
        </Box>
      </Box>
    </Link>
  );

  return (
    <Flex
      as="nav"
      height={ownTheme.height}
      px={[3, 6, 7]}
      align="center"
      justify="center"
      // @ts-ignore
      border="1px solid #e8e8e8"
    >
      <Box width="100%">
        <Flex justify="space-between" align="center">
          {ownTheme.logo.position === "center" && (
            <>
              <Flex
                direction="column"
                display={["none", "flex", "flex"]}
                flex={1}
              >
                <Contact hideAlternate contact={store.contact} />
              </Flex>
              <Flex
                lineHeight={0}
                flex={1}
                align="center"
                justify={["flex-start", "center", "center"]}
              >
                {logo}
              </Flex>
            </>
          )}

          {ownTheme.logo.position === "left" && (
            <Box flex={1} lineHeight={0}>
              {logo}
            </Box>
          )}

          {ownTheme.menu.variant === "full" && (
            <Box
              display={["none", "block", "block"]}
              flex={1}
              minWidth="18rem"
              maxWidth="54rem"
              mx={[2, 3, 4]}
              my={1}
            >
              {presetSearch}
            </Box>
          )}

          <Flex align="center" justify="flex-end" flex={1}>
            {/* TODO: Either show it in a popover, or animate a focused input and hide on blur */}
            {ownTheme.menu.variant === "minimal" && (
              <NavButton
                title={t("actions.search")}
                icon={<Search size="1.5rem" />}
                hideTitle
              />
            )}

            <Link passHref href={urls.products}>
              <NavButton
                title={t("pages.product_plural")}
                icon={<ShoppingBag size="1.5rem" />}
                hideTitle={ownTheme.menu.variant === "minimal"}
              />
            </Link>

            <Link passHref href={urls.about}>
              <NavButton
                title={t("pages.aboutUs")}
                icon={<Briefcase size="1.5rem" />}
                hideTitle={ownTheme.menu.variant === "minimal"}
              />
            </Link>

            <Link passHref href={urls.cart}>
              <NavButton
                title={t("pages.cart")}
                hideTitle
                icon={
                  <Positioner
                    overlayContent={
                      <Badge
                        variant="solid"
                        colorScheme="primary"
                        borderRadius="full"
                        size="sm"
                        py={"1px"}
                      >
                        {cartCount ?? 0}
                      </Badge>
                    }
                  >
                    <ShoppingCart size="1.5rem" />
                  </Positioner>
                }
              />
            </Link>

            <AccountMenu
              user={user}
              handleLogin={login}
              handleLogout={logout}
            />
          </Flex>

          {ownTheme.logo.position === "right" && logo}
        </Flex>

        {ownTheme.menu.variant === "full" && (
          <Box display={["block", "none", "none"]} my={1}>
            {presetSearch}
          </Box>
        )}
      </Box>
    </Flex>
  );
};
