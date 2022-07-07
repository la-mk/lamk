import { Result, Spinner } from "@la-mk/blocks-ui";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../domain/store";
import { getImageURL } from "../../hacks/imageUrl";
import { getStore, PageContextWithStore } from "../../hacks/store";
import { useAuth } from "../../hooks/useAuth";
import { Head } from "../../layout/Head";
import { Cart } from "../../pageComponents/cart/MainCart";
import { Checkout } from "../../pageComponents/checkout/Checkout";
import { getDefaultPrefetch } from "../../sdk/defaults";
import { getProps, newClient } from "../../sdk/queryClient";
import { urls } from "../../tooling/url";

function CheckoutPage({ store }: { store: Store }) {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser()) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  if (!user) {
    return (
      <Result status="empty" mt={8} description={t("auth.noUserInformation")} />
    );
  }

  return (
    <>
      <Head
        url={urls.checkout}
        logo={
          store.logo
            ? {
                ...store.logo,
                defaultUrl: getImageURL(store?.logo?._id, store?._id) ?? "",
              }
            : undefined
        }
        store={store}
        title={t("pages.checkout")}
        description={`${t("pages.checkout")}, ${store?.name}`}
      />

      <Checkout user={user} store={store} />
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

export default CheckoutPage;
