import React from "react";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { urls } from "../../tooling/url";
import { Products } from "../../containers/products/List";
import { utils } from "@la-mk/blocks-ui";
import { Templates } from "../../containers";

function ProductsPage({
  initialFilters,
  store,
  template,
}: {
  initialFilters: FilterObject;
  store: Store;
  template: Templates;
}) {
  const { t } = useTranslation("translation");
  return (
    <>
      <Head
        url={urls.products}
        store={store}
        title={t("pages.product_plural")}
        description={t("seoDescriptions.product_plural")}
      />
      <Products
        template={template}
        store={store}
        initialFilters={initialFilters}
      />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  const store = await getStore(req.headers.host);
  if (!store) {
    return { props: {} };
  }

  const parsedFilters = utils.filter.parseFiltersUrl(req.url ?? "");
  const query = utils.filter.filtersAsQuery(parsedFilters);

  const queryClient = newClient();
  await Promise.all([
    ...getDefaultPrefetch(queryClient, store),
    queryClient.prefetchQuery("product", "findForStore", [store._id, query]),
  ]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      // //FUTURE: We want to remove undefined as nextjs complains, this is the easiest (but not the most performant) way.
      initialFilters: JSON.parse(JSON.stringify(parsedFilters)),
      store,
    },
  };
}

export default ProductsPage;
