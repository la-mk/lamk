import sampleSize from 'lodash/sampleSize';
import React, { useEffect, useState } from 'react';
import { ProductSet } from '../sets/ProductSet';
import { Flex, Spin, hooks, Box } from '@sradevski/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { ProductSet as ProductSetType } from '@sradevski/la-sdk/dist/models/product';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
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

export const Home = ({
  landingContent = {},
}: {
  landingContent: StoreContents['landing'];
}) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const categories = useSelector(getCategories);
  const promotedCampaign = useSelector(getPromotedCampaign);

  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<ProductSetType[]>([]);

  useBreadcrumb([{ url: '/', title: t('pages.home') }]);

  useEffect(() => {
    if (!store || !categories) {
      return;
    }
    let categorySetTags = [];

    if (categories.length) {
      categorySetTags = sampleSize(categories, 3).map(category => ({
        name: 'category',
        value: category.level3,
      }));
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, [
        { name: 'latest' },
        { name: 'discounted' },
        ...categorySetTags,
      ]),
      setProductSets,
    );
  }, [store, categories]);

  const sampleCategories = sampleSize(categories, 3);

  return (
    <>
      <Banner banner={landingContent.banner} storeId={store._id} />

      <Flex mt={7} flexDirection='column'>
        {sampleCategories.length > 1 && (
          <Box px={[2, 4, 5]} mb={7}>
            <CategorySet
              categories={sampleCategories}
              title={t('sets.selectedCategories')}
              subtitle={t('sets.selectedCategoriesExplanation')}
            />
          </Box>
        )}

        <Spin spinning={showSpinner}>
          <>
            {productSets
              .filter(set => Boolean(set.data) && set.data.length > 0)
              .map((set, index) => (
                <React.Fragment
                  key={set.setTag.name + (set.setTag.value || '')}
                >
                  <Box px={[2, 4, 5]} mb={7}>
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
                    <Box mb={7}>
                      <DiscountCampaign campaign={promotedCampaign} />
                    </Box>
                  )}

                  {index === 2 && (
                    <Box mb={7}>
                      <ServicesSet
                        services={[
                          {
                            title: 'Free shipping',
                            subtitle: 'Free shipping over 100$',
                          },
                          {
                            title: 'Secure payments',
                            subtitle: 'Pay securely without a worry',
                          },
                          {
                            title: 'Return policy',
                            subtitle:
                              'Return your products if you are not satisfied',
                          },
                        ]}
                      />
                    </Box>
                  )}
                </React.Fragment>
              ))}
          </>
        </Spin>
      </Flex>
    </>
  );
};
