import sampleSize from 'lodash/sampleSize';
import React, { useEffect, useState } from 'react';
import { ProductSet } from '../sets/ProductSet';
import { Flex, Spinner, hooks, Box, Result } from '@la-mk/blocks-ui';
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../common/i18n';
import { ProductSetResult } from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { getCategories } from '../../state/modules/categories/categories.selector';
import { getPromotedCampaign } from '../../state/modules/campaigns/campaigns.selector';
import { DiscountCampaign } from '../shared/campaigns/DiscountCampaign';
import { CategorySet } from '../sets/CategorySet';
import { ProductGrid } from '../sets/ProductGrid';
import { ServicesSet } from '../sets/ServicesSet';
import { ProductTrio } from '../sets/ProductTrio';
import { Banner } from './Banner';
import { ProductDuo } from '../sets/ProductDuo';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Category } from '@la-mk/la-sdk/dist/models/category';
import { getLandingContent } from '../../state/modules/storeContents/storeContents.selector';

export const Home = ({}: {}) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const landingContent = useSelector(getLandingContent);
  const categories: Category[] = useSelector(getCategories);
  const promotedCampaign = useSelector(getPromotedCampaign);
  const isBrowser = typeof window !== 'undefined';

  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<
    ProductSetResult[] | undefined
  >();

  useBreadcrumb([{ url: '/', title: t('pages.home') }]);

  useEffect(() => {
    if (!store || !categories?.length) {
      return;
    }

    let categorySetTags = [];

    if (categories.length) {
      categorySetTags = sampleSize(categories, 3).map(category => ({
        type: sdk.product.ProductSetType.CATEGORY,
        value: category.level3,
        title: t(
          getTitleForSet({
            type: sdk.product.ProductSetType.CATEGORY,
            value: category.level3,
          }),
        ),
        subtitle: t(
          getSubtitleForSet({
            type: sdk.product.ProductSetType.CATEGORY,
            value: category.level3,
          }),
        ),
      }));
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, [
        ...(landingContent?.sets ?? []).map(set => {
          return {
            ...set,
            title: set.title ?? t(getTitleForSet(set)),
            subtitle: set.subtitle ?? t(getSubtitleForSet(set)),
          };
        }),
        ...categorySetTags,
      ]),
      setProductSets,
    );
  }, [store, categories?.length]);

  const productSetsWithData = productSets?.filter(
    set => Boolean(set.data) && set.data.length > 0,
  );

  return (
    <>
      <Banner
        banner={landingContent?.banner}
        // TODO: This is temporarily, manually added field, remove and find a proper strategy for handling the banner.
        hideSlogan={(landingContent as any)?.hideSlogan}
        store={store}
      />

      <Spinner isLoaded={!showSpinner}>
        <Flex mt={7} direction='column'>
          {categories.length > 1 && (
            <Box px={[2, 4, 5]} mb={8}>
              <CategorySet
                categories={categories}
                title={t('productSets.selectedCategories')}
                subtitle={t('productSets.selectedCategoriesExplanation')}
              />
            </Box>
          )}

          {!showSpinner && !productSetsWithData && isBrowser && (
            <Result
              status='empty'
              mt={8}
              description={t('store.emptyStoreExplanation')}
            />
          )}

          <>
            {(productSetsWithData ?? []).map((set, index) => (
              <React.Fragment key={set.setTag.type + (set.setTag.value || '')}>
                <Box px={[2, 4, 5]} mb={8}>
                  {set.data.length <= 2 ? (
                    <ProductDuo set={set} storeId={store._id} />
                  ) : (
                    <>
                      {index % 4 === 0 && (
                        <ProductSet set={set} storeId={store._id} />
                      )}

                      {index % 4 === 1 && (
                        <ProductGrid set={set} storeId={store._id} />
                      )}

                      {index % 4 === 2 &&
                        (set.data.length > 2 ? (
                          <ProductTrio set={set} storeId={store._id} />
                        ) : (
                          <ProductGrid
                            set={set}
                            horizontal={true}
                            storeId={store._id}
                          />
                        ))}

                      {index % 4 === 3 && (
                        <ProductGrid
                          set={set}
                          horizontal={true}
                          storeId={store._id}
                        />
                      )}
                    </>
                  )}
                </Box>

                {index === 0 && promotedCampaign && (
                  <Box mb={8}>
                    <DiscountCampaign campaign={promotedCampaign} />
                  </Box>
                )}

                {index === 2 && (
                  <Box mb={8}>
                    <ServicesSet />
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
