import { Home as StandardHome } from "../../templates/Standard/home";
import { Home as ElegantHome } from "../../templates/Elegant/home";

import React, { useMemo } from "react";
import { Store } from "../../domain/store";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetResult,
  ProductSetType,
} from "../../domain/set";
import { useTranslation } from "next-i18next";
import { useQuery } from "../../sdk/useQuery";
import { sampleSize } from "../../tooling/util";
import { sortBy } from "lodash";
import { Category } from "../../domain/category";
import { Campaign } from "../../domain/campaign";
import { Media } from "../../domain/media";
import { Templates } from "..";

export interface HomeProps {
  isLoadingCategories: boolean;
  isLoadingSets: boolean;
  store: Store;
  categories: Category[] | undefined;
  productSets: ProductSetResult[] | undefined;
  promotedCampaign: Campaign | undefined;
  banner: Media | undefined;
}

export const Home = ({
  template,
  store,
}: {
  template: Templates;
  store: Store;
}) => {
  const { t } = useTranslation("translation");

  const [landingContent] = useQuery(
    "storeContents",
    "getLandingContentForStore",
    [store._id]
  );
  const [categories, isLoadingCategories] = useQuery(
    "storeCategory",
    "findForStore",
    [store._id]
  );
  const [campaigns, _] = useQuery("campaign", "findActiveForStore", [
    store._id,
  ]);

  const categorySetTags = useMemo(() => {
    if (!categories?.data) {
      return [];
    }

    return sampleSize(sortBy(categories?.data ?? [], "level3"), 10, 3).map(
      (category) => ({
        type: ProductSetType.CATEGORY,
        value: category.level3,
        title: t(
          getTitleForSet({
            type: ProductSetType.CATEGORY,
            value: category.level3,
          })
        ),
        subtitle: t(
          getSubtitleForSet({
            type: ProductSetType.CATEGORY,
            value: category.level3,
          })
        ),
        isPromoted: false,
      })
    );
  }, [categories?.data, t]);

  const [productSets, isLoadingProductSets] = useQuery(
    "product",
    "getProductSetsForStore",
    [
      store._id,
      [
        ...(landingContent?.sets ?? []).map((set) => {
          return {
            ...set,
            title: set.title ?? t(getTitleForSet(set)),
            subtitle: set.subtitle ?? t(getSubtitleForSet(set)),
          };
        }),
        ...categorySetTags,
      ],
    ]
  );

  const productSetsWithData = productSets?.filter(
    (set) => Boolean(set.data) && (set?.data?.length ?? 0) > 0
  );

  const promotedCampaign = campaigns?.data?.find((c) => c.isPromoted);

  const props = {
    store,
    isLoadingCategories,
    isLoadingSets: isLoadingProductSets,
    categories: categories?.data ?? [],
    productSets: productSetsWithData,
    promotedCampaign,
    banner: landingContent?.banner,
  };

  switch (template) {
    case "standard":
      return <StandardHome {...props} />;
    case "elegant":
      return <ElegantHome {...props} />;
  }
};
