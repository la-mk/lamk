import { Result, Spinner } from "@la-mk/blocks-ui";
import { getStore, PageContextWithStore } from "../../../hacks/store";
import { getProps, newClient } from "../../../sdk/queryClient";
import { getDefaultPrefetch } from "../../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../hooks/useAuth";
import { Head } from "../../../layout/Head";
import { urls } from "../../../tooling/url";
import { Orders } from "../../../containers/account/orders/List";
import { Templates } from "../../../containers";

function OrdersPage({
  store,
  template,
}: {
  store: Store;
  template: Templates;
}) {
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
        url={urls.accountOrders}
        store={store}
        title={t("pages.order_plural")}
        description={`${t("pages.order_plural")}, ${store?.name}`}
      />

      <Orders user={user} template={template} store={store} />
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

export default OrdersPage;
