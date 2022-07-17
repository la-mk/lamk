import React from "react";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { transliterate } from "@la-mk/nlp";
import { TFunction, useTranslation } from "next-i18next";
import { Product as ProductType } from "../../domain/product";
import { Store } from "../../domain/store";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { getProps, newClient } from "../../sdk/queryClient";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "../../sdk/useQuery";
import { getImageURL } from "../../hacks/imageUrl";
import { useCart } from "../../hooks/useCart";
import { urls } from "../../tooling/url";
import { Product } from "../../containers/products/Details";
import { Templates } from "../../containers";

//TODO: Un-hardcode transliteration language and either detect it or store it in DB.
const getProductSummary = (
  product: ProductType,
  store: Store,
  t: TFunction
) => {
  const partialDescription = product.description?.slice(0, 130) ?? product.name;
  const transliteratedName = transliterate(product.name, "mk", "en").replace(
    "\n",
    " "
  );

  return `${partialDescription ?? ""}, ${t("common.price")}: ${
    product.minCalculatedPrice
  } ${t(
    `currencies.${store.preferences?.currency ?? "mkd"}`
  )}. ${transliteratedName}`;
};

const ProductPage = ({
  store,
  productId,
  template,
}: {
  store: Store;
  productId: string;
  template: Templates;
}) => {
  const { t } = useTranslation("translation");
  const [product, isLoadingProduct] = useQuery("product", "get", [productId]);

  if (isLoadingProduct) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  if (!product) {
    return (
      <>
        <Head
          url={urls.products}
          store={store}
          title={t("results.pageNotFound")}
          description={t("results.productNotFound")}
        />
        <Result
          status="empty"
          mt={8}
          description={t("results.productNotFound")}
        />
      </>
    );
  }

  return (
    <>
      <Head
        url={`${urls.products}/${product._id}`}
        store={store}
        title={product.name}
        description={getProductSummary(product, store, t)}
        images={product.media.map((mediaFile) => ({
          _id: mediaFile._id,
          size: mediaFile.size,
          mimeType: mediaFile.mimeType,
          url: getImageURL(mediaFile._id, store._id, {
            h: 300,
          }),
          height: mediaFile.height,
          width: mediaFile.width,
        }))}
        product={{
          productName: product.name,
          description: product.description,
          aggregateOffer: {
            priceCurrency: (store.preferences?.currency ?? "mkd").toUpperCase(),
            lowPrice: (product.minCalculatedPrice ?? 0).toFixed(2),
            highPrice: (product.maxCalculatedPrice ?? 0).toFixed(2),
            offerCount: product.variants.length.toString(),
          },
        }}
      />

      <Product
        template={template}
        isLoadingProduct={isLoadingProduct}
        store={store}
        product={product}
      />
    </>
  );
};

export async function getServerSideProps({
  locale,
  query,
  req,
}: PageContextWithStore) {
  const store = await getStore(req.headers.host);
  if (!store) {
    return { props: {} };
  }

  const { pid } = query;
  const queryClient = newClient();
  await Promise.all([
    ...getDefaultPrefetch(queryClient, store),
    queryClient.prefetchQuery("product", "get", [pid as string]),
    queryClient.prefetchQuery("delivery", "findForStore", [store._id]),
  ]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
      productId: pid,
    },
  };
}

export default ProductPage;
