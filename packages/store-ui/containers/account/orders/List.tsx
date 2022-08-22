import { Orders as StandardOrders } from "../../../templates/Standard/account/orders/Orders";
import { Orders as ElegantOrders } from "../../../templates/Elegant/account/orders/Orders";
import { User } from "../../../domain/user";
import { Store } from "../../../domain/store";
import { Templates } from "../..";
import { Order } from "../../../domain/order";
import { FilterObject } from "@la-mk/blocks-ui/dist/hooks/useFilter";
import { hooks, utils } from "@la-mk/blocks-ui";
import { filterRouter } from "../../../tooling/url";
import { useQuery } from "../../../sdk/useQuery";
import { useProtectedRoute } from "../../../hooks/useProtectedRoute";

export interface OrdersProps {
  store: Store;
  orders: Order[];
  totalOrders: number;
  isLoadingOrders: boolean;
  filters: FilterObject;
  setFilters: (filters: FilterObject) => void;
}

const initFilters = {
  sorting: {
    field: "createdAt",
    order: "descend" as "descend" | "ascend",
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
};

export const Orders = ({
  template,
  user,
  store,
}: {
  template: Templates;
  user?: User;
  store: Store;
}) => {
  useProtectedRoute();
  const [filters, setFilters] = hooks.useFilter(initFilters, {
    storage: "url",
    router: filterRouter,
  });

  // TODO: After multiple redirects the initial filters are not preserved
  if (!filters.sorting) {
    filters.sorting = initFilters.sorting;
  }
  if (!filters.pagination) {
    filters.pagination = initFilters.pagination;
  }

  const [orders, isLoadingOrders] = useQuery(
    "order",
    "findForUserFromStore",
    [user?._id ?? "", store._id, utils.filter.filtersAsQuery(filters)],
    { enabled: !!user }
  );

  const props = {
    store,
    orders: orders?.data ?? [],
    isLoadingOrders,
    totalOrders: orders?.total ?? 0,
    filters,
    setFilters: (f: any) => {
      setFilters(f);
    },
  };

  switch (template) {
    case "standard":
      return <StandardOrders {...props} />;
    case "elegant":
      return <ElegantOrders {...props} />;
  }
};
