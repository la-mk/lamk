import React from "react";
import { getStore, PageContextWithStore } from "../../../../hacks/store";
import { getProps, newClient } from "../../../../sdk/queryClient";
import { getDefaultPrefetch } from "../../../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../../hooks/useAuth";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { Head } from "../../../../layout/Head";
import { useQuery } from "../../../../sdk/useQuery";
import { urls } from "../../../../tooling/url";
import { Order } from "../../../../containers/account/orders/Details";
import { Templates } from "../../../../containers";

const OrderPage = ({
  store,
  orderId,
  template,
}: {
  store: Store;
  orderId: string;
  template: Templates;
}) => {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();
  const [order, isLoadingOrder] = useQuery("order", "get", [orderId], {
    enabled: !!user,
  });

  if (isLoadingUser() || isLoadingOrder) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
  }

  if (!user) {
    return (
      <Result status="empty" mt={8} description={t("auth.noUserInformation")} />
    );
  }

  if (!order) {
    return (
      <Result status="empty" mt={8} description={t("order.orderNotFound")} />
    );
  }

  return (
    <>
      <Head
        url={`${urls.accountOrders}/${orderId}`}
        store={store}
        title={t("pages.order")}
        description={`${t("pages.order")}, ${store?.name}`}
      />
      <Order
        user={user}
        template={template}
        isLoadingOrder={isLoadingOrder}
        order={order}
        store={store}
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

  const { oid } = query;
  const queryClient = newClient();
  await Promise.all(getDefaultPrefetch(queryClient, store));

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
      orderId: oid,
    },
  };
}

export default OrderPage;
