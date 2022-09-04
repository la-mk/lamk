import { Header as StandardHeader } from "../../templates/Standard/layout/header";
import { Header as ElegantHeader } from "../../templates/Elegant/layout/header";
import { Templates } from "..";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "next-i18next";
import { useCart } from "../../hooks/useCart";
import { useQuery } from "../../sdk/useQuery";
import { Store } from "../../domain/store";
import { getTitleForSet, ProductSet } from "../../domain/set";
import { Category } from "../../domain/category";

export interface HeaderProps {
  cartCount: number;
  store: Store;
  categories: Category[];
  sets: ProductSet[];
  freeDeliveryOver?: number;
}

export const Header = ({
  template,
  store,
}: {
  template: Templates;
  store: Store;
}) => {
  const { t } = useTranslation("translation");
  const { user } = useAuth();
  const { cart } = useCart(store._id, user, t);
  const [delivery] = useQuery("delivery", "findForStore", [store._id]);
  const [categories] = useQuery("storeCategory", "findForStore", [store._id]);
  const [landingContent] = useQuery(
    "storeContents",
    "getLandingContentForStore",
    [store._id]
  );

  const normalizedSets = landingContent?.sets
    ?.filter((set) => set.isPromoted)
    .map((set) => ({
      ...set,
      title:
        set.title ?? t(getTitleForSet({ type: set.type, value: undefined })),
    }));

  const props = {
    cartCount: cart?.items?.length ?? 0,
    store,
    categories: categories?.data ?? [],
    sets: normalizedSets ?? [],
    freeDeliveryOver: delivery?.data?.[0].freeDeliveryOver,
  };

  switch (template) {
    case "standard":
      return <StandardHeader {...props} />;
    case "elegant":
      return <ElegantHeader {...props} />;
  }
};
