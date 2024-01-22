import React, { ReactElement } from "react";
import { PageContextWithStore } from "../../../../hacks/store";
import { getServerSideResponse } from "../../../../sdk/defaults";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../../hooks/useAuth";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { Head } from "../../../../layout/Head";
import { useQuery } from "../../../../sdk/useQuery";
import { urls } from "../../../../tooling/url";
import { Order } from "../../../../containers/account/orders/Details";
import { Templates } from "../../../../containers";
import { Layout as AccountLayout } from "../../../../containers/account/Layout";
import { NextPageWithLayout } from "../../../_app";

const OrderPage = ({
  store,
  orderId,
  template,
}: NextPageWithLayout & {
  store: Store;
  orderId: string;
  template: Templates;
}) => {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const [order, isLoadingOrder] = useQuery("order", "get", [orderId, store._id], {
    enabled: !!user,
  });

  if (isLoadingOrder) {
    return <Spinner mx="auto" mt={5} isLoaded={false} />;
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

OrderPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
};

export async function getServerSideProps({
  locale,
  query,
  req,
}: PageContextWithStore) {
  const { oid } = query;
  return getServerSideResponse(req, locale, () => [], {orderId: oid})
}

export default OrderPage;
