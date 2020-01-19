import React, { useEffect, useState } from 'react';
import queryString from 'qs';
import { ProductSet } from '../sets/ProductSet';
import { CategoriesList } from '../CategoriesList';
import styled from 'styled-components';
import { Flex, Spin, Image, hooks } from '@sradevski/blocks-ui';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { ProductSet as ProductSetType } from '@sradevski/la-sdk/dist/models/product';
import { StoreContents } from '@sradevski/la-sdk/dist/models/storeContents';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { getCategories } from '../../state/modules/categories/categories.selector';

const Banner = styled.div`
  position: relative;
`;

export const Home = ({
  landingContent = {},
}: {
  landingContent: StoreContents['landing'];
}) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const categories = useSelector(getCategories);
  const [caller, showSpinner] = hooks.useCall();
  const [productSets, setProductSets] = useState<ProductSetType[]>([]);

  useEffect(() => {
    if (!store || !categories) {
      return;
    }
    let categorySetTags = [];

    if (categories.length) {
      categorySetTags = categories.slice(0, 2).map(category => ({
        name: 'category',
        value: category.level3,
      }));
    }

    caller(
      sdk.product.getProductSetsForStore(store._id, [
        { name: 'latest' },
        ...categorySetTags,
      ]),
      setProductSets,
    );
  }, [store, categories]);

  return (
    <>
      <CategoriesList />
      {landingContent.banner && (
        <Banner>
          <Image
            width='100%'
            src={
              landingContent.banner &&
              sdk.artifact.getUrlForArtifact(landingContent.banner, store._id)
            }
            alt='Banner image'
          />
        </Banner>
      )}
      <Spin spinning={showSpinner}>
        <Flex px={[2, 3, 4, 5]} mt={3} flexDirection='column'>
          {productSets
            .filter(set => Boolean(set.data))
            .map(set => (
              <ProductSet
                storeId={store._id}
                allHref={`/products?${queryString.stringify(set.filter)}`}
                key={set.setTag.name + (set.setTag.value || '')}
                products={set.data}
                title={t(getTranslationBaseForSet(set.setTag))}
              />
            ))}
        </Flex>
      </Spin>
    </>
  );
};
