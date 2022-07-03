import React from "react";
import { PageContextWithStore } from "../../hacks/store";
import { getProps, newClient } from "../../sdk/queryClient";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Store } from "../../domain/store";
import { Head } from "../../layout/Head";
import { hooks, utils } from "@la-mk/blocks-ui";
import { useQuery } from "../../sdk/useQuery";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { filterRouter, urls } from "../../tooling/url";
import { Products } from "../../pageComponents/products/Products";

function ProductsPage({
  initialFilters,
  store,
}: {
  initialFilters: FilterObject;
  store: Store;
}) {
  const { t } = useTranslation("translation");
  // TODO: There is no clear way to reset filters that are not part of the sidemenu as of now, nor filters that don't apply when searching.
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: "url",
    router: filterRouter,
  });

  const [products, isLoadingProducts] = useQuery(
    "product",
    "findForStore",
    [store._id, utils.filter.filtersAsQuery(filters)],
    { keepPreviousData: true }
  );

  const [categories, isLoadingCategories] = useQuery(
    "storeCategory",
    "findForStore",
    [store._id]
  );

  return (
    <>
      <Head
        url={urls.products}
        store={store}
        title={t("pages.product_plural")}
        description={t("seoDescriptions.product_plural")}
      />
      <Products
        categories={categories?.data ?? []}
        store={store}
        totalProducts={products?.total ?? 0}
        products={products?.data ?? []}
        isLoadingProducts={isLoadingProducts || isLoadingCategories}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req: { store, url },
}: PageContextWithStore) {
  if (!store) {
    return { props: {} };
  }

  const parsedFilters = utils.filter.parseFiltersUrl(url ?? "");
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
      //FUTURE: We want to remove undefined as nextjs complains, this is the easiest (but not the most performant) way.
      initialFilters: JSON.parse(JSON.stringify(parsedFilters)),
    },
  };
}

export default ProductsPage;
