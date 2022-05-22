import React from "react";
import { Flex, Layout, Box } from "@la-mk/blocks-ui";
import { FooterContent } from "./Footer/FooterContent";
import { Store } from "../domain/store";
import { BreadcrumbsProvider } from "./BreadcrumbsProvider";
import { Header } from "./Header";
import { SubMenu } from "./SubMenu/SubMenu";
import { useQuery } from "../sdk/useQuery";
import { AccountMenu } from "./Account/AccountMenu";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useCart } from "../hooks/useCart";
import { useTranslation } from "next-i18next";
import { urls } from "../tooling/url";
import { getSetHref, getTitleForSet } from "../domain/set";

export const StoreLayout = ({
  children,
  store,
}: {
  children: React.ReactElement;
  store: Store;
}) => {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation("translation");
  const { cart } = useCart(store, user, t);
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

  return (
    <Layout
      header={
        <Box>
          <Header cartCount={cart.items.length} store={store} />
          <SubMenu
            categories={categories?.data ?? []}
            sets={normalizedSets ?? []}
          />
        </Box>
      }
      footer={
        <Box bg="background.dark">
          <FooterContent store={store} />
        </Box>
      }
      leftSider={
        !!user && pathname.startsWith(urls.account) ? (
          <Box display={["none", "block", "block"]} height="100%">
            <AccountMenu user={user} />
          </Box>
        ) : null
      }
    >
      <Box mb={7} minHeight="calc(100vh - 200px)">
        <div id="categories-portal-root" />
        <BreadcrumbsProvider>
          <Flex direction="column">{children}</Flex>
        </BreadcrumbsProvider>
      </Box>
    </Layout>
  );
};
