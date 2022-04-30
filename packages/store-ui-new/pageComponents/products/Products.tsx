import React, { useState } from "react";
import {
  DataGrid,
  hooks,
  Flex,
  Box,
  Drawer,
  Button,
  Divider,
  Result,
} from "@la-mk/blocks-ui";
import { Filter } from "react-feather";
import { Store } from "../../domain/store";
import { Product } from "../../domain/product";
import { Category } from "../../domain/category";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { Page } from "../../layout/Page";
import { ProductCard } from "./ProductCard";
import { SortFilter } from "../../components/filters/SortFilter";
import { ProductsSidemenu } from "./ProductsSidemenu";

interface ProductsProps {
  products: Product[];
  categories: Category[];
  totalProducts: number;
  isLoadingProducts: boolean;
  filters?: FilterObject;
  setFilters: (filters: FilterObject) => void;
  store: Store;
}

export const Products = ({
  products,
  categories,
  totalProducts,
  isLoadingProducts,
  filters = {},
  setFilters,
  store,
}: ProductsProps) => {
  const { t } = useTranslation("translation");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const paginationSize = hooks.useBreakpoint<"sm" | "md">(["sm", "md", "md"]);

  useBreadcrumbs([
    { url: "/", title: t("pages.home") },
    { url: "/products", title: t("pages.product_plural") },
  ]);

  return (
    <Page>
      <Flex direction={["column", "column", "row"]}>
        <ProductsSidemenu
          categories={categories}
          height="100%"
          display={["none", "none", "initial"]}
          mr={3}
          filters={filters}
          setFilters={setFilters}
          currency={store.preferences?.currency ?? "mkd"}
        />
        {/* The drawer is always visible, but the button to toggle it is only visible on mobile. The only time this is somewhat of an issue is when opening the modal, and then resizing the window, but even then the experience is pretty good. */}
        <Drawer
          size="sm"
          title={t("common.filter_plural")}
          isOpen={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          placement="left"
        >
          <ProductsSidemenu
            categories={categories}
            pt={3}
            currency={store.preferences?.currency ?? "mkd"}
            filters={filters}
            setFilters={setFilters}
          />
        </Drawer>

        <Box mb={2} display={["initial", "initial", "none"]}>
          <Flex direction="column" align="center" justify="center">
            <Button
              size="lg"
              variant="ghost"
              leftIcon={<Filter size="1.2rem" />}
              onClick={() => setIsDrawerVisible(true)}
            >
              {t("common.filter_plural")}
            </Button>
            <Divider my={3} />
          </Flex>
        </Box>

        <Flex
          width="100%"
          direction="column"
          align="center"
          justify="flex-start"
        >
          <Box mb={7}>
            <SortFilter filters={filters} onChange={setFilters} />
          </Box>

          {totalProducts === 0 && !isLoadingProducts && (
            <Result
              status="empty"
              description={t("product.noMatchingProduct_plural")}
            />
          )}
          {(totalProducts > 0 || isLoadingProducts) && (
            <DataGrid
              spacing={[4, 6, 6]}
              isLoaded={!isLoadingProducts}
              rowKey="_id"
              items={products}
              renderItem={(item) => (
                <ProductCard product={item} store={store} />
              )}
              pagination={{
                size: paginationSize,
                currentPage: filters.pagination?.currentPage ?? 1,
                pageSize: filters.pagination?.pageSize ?? 20,
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
        </Flex>
      </Flex>
    </Page>
  );
};
