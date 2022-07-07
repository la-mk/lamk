import React from "react";
import { Flex, Box } from "@la-mk/blocks-ui";
import { FooterContent } from "./Footer/FooterContent";
import { Store } from "../domain/store";
import { Header } from "./Header";
import { SubMenu } from "./SubMenu/SubMenu";
import { useQuery } from "../sdk/useQuery";
import { AccountMenu } from "./Account/AccountMenu";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "next-i18next";
import { urls } from "../tooling/url";
import { getTitleForSet } from "../domain/set";
import { isEqual } from "lodash";

export const StoreLayout = React.memo(
  ({ children, store }: { children: React.ReactElement; store: Store }) => {
    const { pathname } = useRouter();
    const { user } = useAuth();
    const { t } = useTranslation("translation");
    const { cart } = useCart(store._id, user, t);
    const [categories] = useQuery("storeCategory", "findForStore", [store._id]);
    const [landingContent] = useQuery(
      "storeContents",
      "getLandingContentForStore",
      [store._id]
    );

    const normalizedSets = landingContent?.sets
      ?.filter((set) => set.isPromoted)
      .map((set) => ({
        ...set,
        title:
          set.title ?? t(getTitleForSet({ type: set.type, value: undefined })),
      }));

    const isInAccountsPage = !!user && pathname.startsWith(urls.account);

    return (
      <>
        <Box>
          <Header cartCount={cart.items.length} store={store} />
          <SubMenu
            categories={categories?.data ?? []}
            sets={normalizedSets ?? []}
          />
        </Box>
        {/* @ts-ignore */}
        <Flex style={{ position: "relative " }} direction="row">
          {isInAccountsPage ? (
            <Box
              // @ts-ignore
              style={{ position: "absolute" }}
              display={["none", "block", "block"]}
              height="100%"
              width={["100%", "14rem", "14rem"]}
            >
              <AccountMenu user={user} />
            </Box>
          ) : null}
          <Box
            ml={isInAccountsPage ? ["none", "14rem", "14rem"] : undefined}
            flex={1}
            mb={7}
            minHeight="calc(100vh - 200px)"
            maxWidth={"100%"}
          >
            <div id="categories-portal-root" />
            <Flex direction="column">{children}</Flex>
          </Box>
        </Flex>
        <Box bg="background.dark">
          <FooterContent store={store} />
        </Box>
      </>
    );
  },
  (prev, next) => {
    return isEqual(prev.store, next.store) && prev.children === next.children;
  }
);

StoreLayout.displayName = "StoreLayout";
