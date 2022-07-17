import { Order as StandardOrder } from "../../../templates/Standard/account/orders/Order";
import { Order as ElegantOrder } from "../../../templates/Elegant/account/orders/Order";
import { Store } from "../../../domain/store";
import { Templates } from "../..";
import { Order as OrderType } from "../../../domain/order";
import { useRouter } from "next/router";
import { useQuery } from "../../../sdk/useQuery";
import { urls } from "../../../tooling/url";
import { TFunction, useTranslation } from "next-i18next";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetResult,
  ProductSetType,
} from "../../../domain/set";
import { User } from "../../../domain/user";

export interface OrderProps {
  user: User;
  order: OrderType;
  store: Store;
  isLoadingOrder: boolean;
  sets: ProductSetResult[];
  isLoadingSets: boolean;
  onPayment: () => void;
}

const getSets = (t: TFunction) => [
  {
    title: t(
      getTitleForSet({
        type: ProductSetType.DISCOUNTED,
        value: undefined,
      })
    ),
    subtitle: t(
      getSubtitleForSet({
        type: ProductSetType.DISCOUNTED,
        value: undefined,
      })
    ),
    type: ProductSetType.DISCOUNTED,
    value: undefined,
    isPromoted: false,
  },
];

export const Order = ({
  template,
  order,
  store,
  user,
  isLoadingOrder,
}: {
  template: Templates;
  order: OrderType;
  store: Store;
  user: User;
  isLoadingOrder: boolean;
}) => {
  const { t } = useTranslation("translation");
  const router = useRouter();

  const [sets, isLoadingSets] = useQuery("product", "getProductSetsForStore", [
    store._id,
    getSets(t),
  ]);

  const handlePayment = () => {
    router.push(`${urls.accountOrders}/${order._id}/pay`);
  };

  const props = {
    user,
    store,
    order,
    isLoadingOrder,
    onPayment: handlePayment,
    sets: sets ?? [],
    isLoadingSets,
  };

  switch (template) {
    case "standard":
      return <StandardOrder {...props} />;
    case "elegant":
      return <ElegantOrder {...props} />;
  }
};
