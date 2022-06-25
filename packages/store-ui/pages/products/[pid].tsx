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
import { PageContextWithStore } from "../../hacks/store";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "../../sdk/useQuery";
import { getImageURL } from "../../hacks/imageUrl";
import { Product } from "../../pageComponents/products/Product";
import { useRouter } from "next/router";
import { useCart } from "../../hooks/useCart";
import { urls } from "../../tooling/url";

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

const ProductPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const productId = router.query.pid as string;

  const { user } = useAuth();
  const { cart, addToCart } = useCart(store, user, t);
  const [product, isLoadingProduct] = useQuery("product", "get", [productId]);
  const [delivery, isLoadingDelivery] = useQuery("delivery", "findForStore", [
    store._id,
  ]);

  if (isLoadingProduct || isLoadingDelivery) {
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
        isLoadingProduct={isLoadingProduct || isLoadingDelivery}
        store={store}
        cart={cart}
        delivery={delivery?.data?.[0]}
        product={product}
        addToCart={(attributes, quantity) =>
          addToCart(product, attributes, quantity)
        }
      />
    </>
  );
};

export async function getServerSideProps({
  locale,
  query,
  req: { store },
}: PageContextWithStore) {
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
    },
  };
}

export default ProductPage;
