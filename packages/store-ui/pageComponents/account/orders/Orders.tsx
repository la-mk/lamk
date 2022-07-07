import React from "react";
import { DataGrid, Result } from "@la-mk/blocks-ui";
import { OrderDescription } from "./OrderDescription";
import { BackButton } from "../BackButton";
import { User } from "../../../domain/user";
import { Store } from "../../../domain/store";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { useTranslation } from "next-i18next";
import { Page } from "../../../layout/Page";
import { CustomCard } from "../../../components/CustomCard";
import { Order } from "../../../domain/order";
import { urls } from "../../../tooling/url";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

export const Orders = ({
  user,
  store,
  orders,
  totalOrders,
  isOrdersLoading,
  filters,
  setFilters,
}: {
  user: User;
  store: Store;
  orders: Order[];
  totalOrders: number;
  isOrdersLoading: boolean;
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}) => {
  const { t } = useTranslation("translation");

  if (orders && totalOrders === 0 && !isOrdersLoading) {
    return (
      <Result
        status="empty"
        mt={8}
        description={t("order.orderNotFound_plural")}
      />
    );
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { url: urls.home, title: t("pages.home") },
          { url: urls.accountOrders, title: t("pages.order_plural") },
        ]}
      />
      <Page maxWidth={"86rem"}>
        <BackButton />
        <DataGrid<Order>
          mt={5}
          isFullWidth
          rowKey={"_id"}
          spacing={[7, 7, 8]}
          pagination={{
            currentPage: filters.pagination
              ? filters.pagination.currentPage
              : 1,
            pageSize: filters.pagination ? filters.pagination.pageSize : 10,
            totalItems: orders ? totalOrders : 0,
            onChange: (currentPage, pageSize) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setFilters({
                ...filters,
                pagination: { currentPage, pageSize },
              });
            },
          }}
          isLoaded={!isOrdersLoading}
          items={orders ?? []}
          renderItem={(order) => (
            <CustomCard mx="auto" width="100%" overflow="hidden">
              <OrderDescription order={order} store={store} />
            </CustomCard>
          )}
        ></DataGrid>
      </Page>
    </>
  );
};
