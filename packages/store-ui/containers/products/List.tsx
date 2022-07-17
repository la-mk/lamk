import { Products as StandardProducts } from "../../templates/Standard/products/Products";
import { Products as ElegantProducts } from "../../templates/Elegant/products/Products";
import { Templates } from "..";
import { hooks, utils } from "@la-mk/blocks-ui";
import { Store } from "../../domain/store";
import { useQuery } from "../../sdk/useQuery";
import { filterRouter } from "../../tooling/url";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { Product } from "../../domain/product";
import { Category } from "../../domain/category";

export interface ProductsProps {
  products: Product[];
  categories: Category[];
  totalProducts: number;
  isLoadingProducts: boolean;
  filters?: FilterObject;
  setFilters: (filters: FilterObject) => void;
  store: Store;
}

export const Products = ({
  template,
  store,
  initialFilters,
}: {
  template: Templates;
  store: Store;
  initialFilters: FilterObject;
}) => {
  // TODO: There is no clear way to reset filters that are not part of the sidemenu as of now, nor filters that don't apply when searching.
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: "url",
    router: filterRouter,
  });

  const [products, isLoadingProducts] = useQuery(
    "product",
    "findForStore",
    [store._id, utils.filter.filtersAsQuery(filters)],
    { keepPreviousData: true }
  );

  const [categories] = useQuery("storeCategory", "findForStore", [store._id]);

  const props = {
    store,
    products: products?.data ?? [],
    categories: categories?.data ?? [],
    totalProducts: products?.total ?? 0,
    isLoadingProducts,
    filters,
    setFilters: setFilters,
  };

  switch (template) {
    case "standard":
      return <StandardProducts {...props} />;
    case "elegant":
      return <ElegantProducts {...props} />;
  }
};
