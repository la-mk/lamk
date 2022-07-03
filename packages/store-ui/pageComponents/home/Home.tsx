import React, { useMemo } from "react";
import { Flex, Spinner, Box, Result } from "@la-mk/blocks-ui";
import { Banner } from "./Banner";
import { Store } from "../../domain/store";
import {
  getSubtitleForSet,
  getTitleForSet,
  ProductSetType,
} from "../../domain/set";
import { useTranslation } from "next-i18next";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs";
import { getLevel2CategoryHref, urls } from "../../tooling/url";
import { ProductDuo } from "../../components/sets/ProductDuo";
import { ProductSet } from "../../components/sets/ProductSet";
import { ProductGrid } from "../../components/sets/ProductGrid";
import { ProductTrio } from "../../components/sets/ProductTrio";
import { ServicesSet } from "../../components/sets/ServicesSet";
import { CategorySet } from "../../components/sets/CategorySet";
import { useQuery } from "../../sdk/useQuery";
import { DiscountCampaign } from "../../components/campaigns/DiscountCampaign";
import { sampleSize } from "../../tooling/util";
import { sortBy } from "lodash";

export const Home = ({ store }: { store: Store }) => {
  const { t } = useTranslation("translation");
  useBreadcrumbs([{ url: urls.home, title: t("pages.home") }]);

  const [landingContent, isLoadingLandingContent] = useQuery(
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

  console.log(categorySetTags, productSets);

  const productSetsWithData = productSets?.filter(
    (set) => Boolean(set.data) && (set?.data?.length ?? 0) > 0
  );

  const promotedCampaign = campaigns?.data?.find((c) => c.isPromoted);

  return (
    <>
      <Banner
        banner={landingContent?.banner}
        // TODO: This is temporarily, manually added field, remove and find a proper strategy for handling the banner.
        hideSlogan={(landingContent as any)?.hideSlogan}
        store={store}
      />

      <Spinner isLoaded={!isLoadingLandingContent || !isLoadingCategories}>
        <Flex mt={7} direction="column">
          {(categories?.data?.length ?? 0) > 1 && (
            <Box px={[2, 4, 5]} mb={8}>
              <CategorySet
                getCategoryHref={(categorySlug) =>
                  getLevel2CategoryHref(categorySlug, categories?.data ?? [])
                }
                categories={categories?.data ?? []}
                title={t("productSets.selectedCategories")}
                subtitle={t("productSets.selectedCategoriesExplanation")}
              />
            </Box>
          )}

          {!isLoadingProductSets && productSetsWithData?.length === 0 && (
            <Result
              status="empty"
              mt={8}
              description={t("store.emptyStoreExplanation")}
            />
          )}

          <>
            {(productSetsWithData ?? []).map((set, index) => (
              <React.Fragment key={set.setTag.type + (set.setTag.value || "")}>
                <Box px={[2, 4, 5]} mb={8}>
                  {(set?.data?.length ?? 0) <= 2 ? (
                    <ProductDuo set={set} store={store} />
                  ) : (
                    <>
                      {index % 4 === 0 && (
                        <ProductSet set={set} store={store} />
                      )}

                      {index % 4 === 1 && (
                        <ProductGrid set={set} store={store} />
                      )}

                      {index % 4 === 2 &&
                        ((set?.data?.length ?? 0) > 2 ? (
                          <ProductTrio set={set} store={store} />
                        ) : (
                          <ProductGrid
                            set={set}
                            horizontal={true}
                            store={store}
                          />
                        ))}

                      {index % 4 === 3 && (
                        <ProductGrid
                          set={set}
                          horizontal={true}
                          store={store}
                        />
                      )}
                    </>
                  )}
                </Box>

                {index === 0 && promotedCampaign && (
                  <Box mb={8}>
                    <DiscountCampaign
                      store={store}
                      campaign={promotedCampaign}
                    />
                  </Box>
                )}

                {index === 2 && (
                  <Box mb={8}>
                    <ServicesSet store={store} />
                  </Box>
                )}
              </React.Fragment>
            ))}
          </>
        </Flex>
      </Spinner>
    </>
  );
};
