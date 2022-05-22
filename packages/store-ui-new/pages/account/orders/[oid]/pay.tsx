import React from "react";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { PageContextWithStore } from "../../../../hacks/store";
import { getProps, newClient } from "../../../../sdk/queryClient";
import { getDefaultPrefetch } from "../../../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAuth } from "../../../../hooks/useAuth";
import { useQuery } from "../../../../sdk/useQuery";
import { Head } from "../../../../layout/Head";
import { Payment } from "../../../../pageComponents/account/orders/Payment";
import { urls } from "../../../../tooling/url";

const OrderPayPage = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const orderId = router.query.oid as string;

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
        url={`${urls.accountOrders}/${orderId}/pay`}
        store={store}
        title={t("pages.payment")}
        description={`${t("pages.payment")}, ${t("pages.order")} ${orderId}`}
      />

      <Payment isLoadingOrder={isLoadingOrder} store={store} order={order} />
    </>
  );
};

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
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
export default OrderPayPage;
