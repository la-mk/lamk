import React from "react";
import { Card, DataGrid, Result } from "@la-mk/blocks-ui";
import { OrderDescription } from "./OrderDescription";
import { useTranslation } from "next-i18next";
import { Order } from "../../../../domain/order";
import { OrdersProps } from "../../../../containers/account/orders/List";

export const Orders = ({
  store,
  orders,
  totalOrders,
  isLoadingOrders,
  filters,
  setFilters,
}: OrdersProps) => {
  const { t } = useTranslation("translation");
  const hasOrders = !(orders && totalOrders === 0 && !isLoadingOrders);

  return (
    <>
      {hasOrders ? (
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
          isLoaded={!isLoadingOrders}
          items={orders ?? []}
          renderItem={(order) => (
            <Card mx="auto" width="100%" maxWidth={"54rem"} overflow="hidden">
              <OrderDescription order={order} store={store} />
            </Card>
          )}
        ></DataGrid>
      ) : (
        <Result
          status="empty"
          mt={8}
          description={t("order.orderNotFound_plural")}
        />
      )}
    </>
  );
};
