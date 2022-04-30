import React from "react";
import { PageContextWithStore } from "../../../../hacks/store";
import { getProps, newClient } from "../../../../sdk/queryClient";
import { getDefaultPrefetch } from "../../../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../../hooks/useAuth";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { Head } from "../../../../layout/Head";
import { useQuery } from "../../../../sdk/useQuery";
import { useRouter } from "next/router";
import { Order } from "../../../../pageComponents/account/orders/Order";

const OrderPage = ({ store, orderId }: { store: Store; orderId: string }) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const { oid } = router.query;
  const { user, isLoadingUser } = useAuth();
  const [order, isLoadingOrder] = useQuery("order", "get", [oid as string], {
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
        url={`/orders/${orderId}`}
        store={store}
        title={t("pages.order")}
        description={`${t("pages.order")}, ${store?.name}`}
      />
      <Order
        isLoadingOrder={isLoadingOrder}
        order={order}
        user={user}
        store={store}
      />
    </>
  );
};

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
  const queryClient = newClient();
  await Promise.all([...getDefaultPrefetch(queryClient, store)]);

  return {
    props: {
      ...getProps(queryClient),
      ...(await serverSideTranslations(locale ?? "mk", ["translation"])),
      store,
    },
  };
}

export default OrderPage;
