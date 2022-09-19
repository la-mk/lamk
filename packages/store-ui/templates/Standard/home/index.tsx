import React from "react";
import { Flex, Spinner, Box, Result } from "@la-mk/blocks-ui";

import { useTranslation } from "next-i18next";
import { getLevel2CategoryHref, urls } from "../../../tooling/url";
import { ProductDuo } from "../components/sets/ProductDuo";
import { ProductSet } from "../components/sets/ProductSet";
import { ProductGrid } from "../components/sets/ProductGrid";
import { ProductTrio } from "../components/sets/ProductTrio";
import { ServicesSet } from "../components/sets/ServicesSet";
import { CategorySet } from "../components/sets/CategorySet";
import { DiscountCampaign } from "../components/campaigns/DiscountCampaign";
import { Banner } from "./Banner";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { HomeProps } from "../../../containers/home";

export const Home = ({
  isLoadingCategories,
  isLoadingSets,
  categories,
  productSets,
  store,
  promotedCampaign,
  banner,
  hideSlogan,
}: HomeProps) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Breadcrumbs breadcrumbs={[{ url: urls.home, title: t("pages.home") }]} />

      <Banner banner={banner} store={store} hideSlogan={hideSlogan} />

      <Spinner isLoaded={!isLoadingCategories}>
        <Flex mt={7} direction="column">
          {(categories?.length ?? 0) > 1 && (
            <Box px={[2, 4, 5]} mb={8}>
              <CategorySet
                getCategoryHref={(categorySlug) =>
                  getLevel2CategoryHref(categorySlug, categories ?? [])
                }
                categories={categories ?? []}
                title={t("productSets.selectedCategories")}
                subtitle={t("productSets.selectedCategoriesExplanation")}
              />
            </Box>
          )}

          {!isLoadingSets && productSets?.length === 0 && (
            <Result
              status="empty"
              mt={8}
              description={t("store.emptyStoreExplanation")}
            />
          )}

          <>
            {(productSets ?? []).map((set, index) => (
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
