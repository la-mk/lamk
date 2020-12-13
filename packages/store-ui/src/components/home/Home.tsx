import sampleSize from 'lodash/sampleSize';
import React, { useEffect, useState } from 'react';
import { ProductSet } from '../sets/ProductSet';
import { Flex, Spinner, hooks, Box, Result } from '@sradevski/blocks-ui';
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../common/i18n';
import { ProductSetResult } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
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
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { getLandingContent } from '../../state/modules/storeContents/storeContents.selector';

export const Home = ({}: {}) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const landingContent = useSelector(getLandingContent);
  const categories: Category[] = useSelector(getCategories);
  const promotedCampaign = useSelector(getPromotedCampaign);

  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<ProductSetResult[]>([]);
  const [categoriesForSet, setCategoriesForSet] = useState<string[]>([]);

  useBreadcrumb([{ url: '/', title: t('pages.home') }]);

  useEffect(() => {
    if (!store || !categories?.length) {
      return;
    }

    setCategoriesForSet(
      sampleSize(
        Array.from(new Set(categories.map(category => category.level2))),
        3,
      ),
    );

    let categorySetTags = [];

    if (categories.length) {
      categorySetTags = sampleSize(categories, 3).map(category => ({
        type: 'category',
        value: category.level3,
        title: t(getTitleForSet({ type: 'category', value: category.level3 })),
        subtitle: t(
          getSubtitleForSet({
            type: 'category',
            value: category.level3,
          }),
        ),
      }));
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, [
        ...(landingContent?.sets ?? []),
        {
          type: 'discounted',
          title: t(getTitleForSet({ type: 'discounted', value: undefined })),
          subtitle: t(
            getSubtitleForSet({ type: 'discounted', value: undefined }),
          ),
        },
        {
          type: 'latest',
          title: t(getTitleForSet({ type: 'latest', value: undefined })),
          subtitle: t(getSubtitleForSet({ type: 'latest', value: undefined })),
        },
        ...categorySetTags,
      ]),
      setProductSets,
    );
  }, [store, categories?.length]);

  const productSetsWithData = productSets.filter(
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

      <Flex mt={7} direction='column'>
        {categoriesForSet.length > 1 && (
          <Box px={[2, 4, 5]} mb={8}>
            <CategorySet
              categoriesToShow={categoriesForSet}
              categories={categories}
              title={t('chosenSets.selectedCategories')}
              subtitle={t('chosenSets.selectedCategoriesExplanation')}
            />
          </Box>
        )}

        {!showSpinner && productSetsWithData.length === 0 && (
          <Result
            status='empty'
            mt={8}
            description={t('store.emptyStoreExplanation')}
          />
        )}

        <Spinner isLoaded={!showSpinner}>
          <>
            {productSetsWithData.map((set, index) => (
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
        </Spinner>
      </Flex>
    </>
  );
};
