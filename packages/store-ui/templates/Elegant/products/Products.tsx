import { DataGrid, hooks } from "@la-mk/blocks-ui";
import React from "react";
import { ProductsProps } from "../../../containers/products/List";
import { ProductCard } from "../components/product/ProductCard/ProductCard";
import { Page } from "../Page";

export const Products = ({
  products,
  store,
  totalProducts,
  isLoadingProducts,
  filters,
  setFilters,
}: ProductsProps) => {
  const paginationSize = hooks.useBreakpoint<"sm" | "md">(["sm", "md", "md"]);

  return (
    <Page>
      {(totalProducts > 0 || isLoadingProducts) && (
        <DataGrid
          my={4}
          spacing={[4, 4, 5]}
          isLoaded={!isLoadingProducts}
          rowKey="_id"
          items={products}
          renderItem={(item) => <ProductCard product={item} store={store} />}
          pagination={{
            size: paginationSize,
            currentPage: filters?.pagination?.currentPage ?? 1,
            pageSize: filters?.pagination?.pageSize ?? 20,
            totalItems: totalProducts,
            onChange: (currentPage: number, pageSize: number) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setFilters({
                ...filters,
                pagination: { currentPage, pageSize },
              });
            },
          }}
        />
      )}
    </Page>
  );
};
