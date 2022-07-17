import { Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { Cart } from "../../containers/cart";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { getProps, newClient } from "../../sdk/queryClient";
import { urls } from "../../tooling/url";
import { Templates } from "../../containers";

function CartPage({ store, template }: { store: Store; template: Templates }) {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  return (
    <>
      <Head
        url={urls.cart}
        logo={
          store.logo
            ? {
                ...store.logo,
                defaultUrl: getImageURL(store?.logo?._id, store?._id) ?? "",
              }
            : undefined
        }
        store={store}
        title={t("pages.cart")}
        description={`${t("pages.cart")}, ${store?.name}`}
      />

      <Cart template={template} user={user} store={store} />
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

  const queryClient = newClient();
  await Promise.all(getDefaultPrefetch(queryClient, store));

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
    },
  };
}

export default CartPage;
