import React, { ReactElement } from "react";
import { Result, Spinner } from "@la-mk/blocks-ui";
import { Store } from "../../../../domain/store";
import { useTranslation } from "next-i18next";
import { PageContextWithStore } from "../../../../hacks/store";
import { getServerSideResponse } from "../../../../sdk/defaults";
import { useAuth } from "../../../../hooks/useAuth";
import { useQuery } from "../../../../sdk/useQuery";
import { Head } from "../../../../layout/Head";
import { urls } from "../../../../tooling/url";
import { Pay } from "../../../../containers/account/orders/Pay";
import { Templates } from "../../../../containers";
import { Layout as AccountLayout } from "../../../../containers/account/Layout";
import { NextPageWithLayout } from "../../../_app";

const OrderPayPage = ({
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
  const [order, isLoadingOrder] = useQuery("order", "get", [orderId], {
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
        url={`${urls.accountOrders}/${orderId}/pay`}
        store={store}
        title={t("pages.payment")}
        description={`${t("pages.payment")}, ${t("pages.order")} ${orderId}`}
      />

      <Pay
        template={template}
        isLoadingOrder={isLoadingOrder}
        store={store}
        order={order}
      />
    </>
  );
};

OrderPayPage.getLayout = (page: ReactElement, template: Templates) => {
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
export default OrderPayPage;
