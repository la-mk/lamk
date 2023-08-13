import { PageContextWithStore } from "../../../hacks/store";
import { getServerSideResponse } from "../../../sdk/defaults";
import { Store } from "../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../hooks/useAuth";
import { Head } from "../../../layout/Head";
import { urls } from "../../../tooling/url";
import { Orders } from "../../../containers/account/orders/List";
import { Templates } from "../../../containers";
import { Layout as AccountLayout } from "../../../containers/account/Layout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";

function OrdersPage({
  store,
  template,
}: NextPageWithLayout & {
  store: Store;
  template: Templates;
}) {
  const { t } = useTranslation("translation");
  const { user } = useAuth();

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

OrdersPage.getLayout = (page: ReactElement, template: Templates) => {
  return <AccountLayout template={template}>{page}</AccountLayout>;
};

export async function getServerSideProps({
  locale,
  req,
}: PageContextWithStore) {
  return getServerSideResponse(req, locale, () => [])
}

export default OrdersPage;
