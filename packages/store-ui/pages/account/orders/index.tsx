import { hooks, Result, Spinner, utils } from "@la-mk/blocks-ui";
import Router from "next/router";
import { PageContextWithStore } from "../../../hacks/store";
import { getProps, newClient } from "../../../sdk/queryClient";
import { getDefaultPrefetch } from "../../../sdk/defaults";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Store } from "../../../domain/store";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../../hooks/useAuth";
import { Head } from "../../../layout/Head";
import { useQuery } from "../../../sdk/useQuery";
import { Orders } from "../../../pageComponents/account/orders/Orders";
import { urls } from "../../../tooling/url";

function OrdersPage({ store }: { store: Store }) {
  const { t } = useTranslation("translation");
  const { user, isLoadingUser } = useAuth();
  const [filters, setFilters] = hooks.useFilter(
    {
      sorting: {
        field: "createdAt",
        order: "descend",
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    },
    {
      storage: "url",
      router: Router,
    }
  );

  const [orders, isLoadingOrders] = useQuery(
    "order",
    "findForUserFromStore",
    [user?._id ?? "", store._id, utils.filter.filtersAsQuery(filters)],
    { enabled: !!user }
  );

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

      <Orders
        filters={filters}
        setFilters={setFilters}
        user={user}
        store={store}
        isOrdersLoading={isLoadingOrders}
        totalOrders={orders?.total ?? 0}
        orders={orders?.data ?? []}
      />
    </>
  );
}

export async function getServerSideProps({
  locale,
  req: { store },
}: PageContextWithStore) {
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
