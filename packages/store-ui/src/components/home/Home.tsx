import React, { useEffect, useState } from 'react';
import { ProductSet } from '../sets/ProductSet';
import { CategoriesList } from '../CategoriesList';
import styled from 'styled-components';
import { Flex, Spin } from '@lamk/blocks-ui';
import { useTranslation, getTranslationBaseForSet } from '../../common/i18n';
import { ProductSet as ProductSetType } from '@lamk/la-sdk/dist/models/product';
import { StoreContents } from '@lamk/la-sdk/dist/models/storeContents';
import { sdk } from '@lamk/la-sdk';
import { useCall } from '../shared/hooks/useCall';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { getCategories } from '../../state/modules/categories/categories.selector';

const Banner = styled.div`
  position: relative;
`;

const ImageBanner = styled.img`
  object-fit: contain;
  width: 100%;
  height: auto;
`;

export const Home = ({
  landingContent,
}: {
  landingContent: StoreContents['landing'];
}) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const categories = useSelector(getCategories);
  const [caller, showSpinner] = useCall();
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
      <Banner>
        {landingContent.banner && (
          <ImageBanner
            src={sdk.artifact.getUrlForArtifact(landingContent.banner)}
            alt='Banner image'
          />
        )}
      </Banner>
      <Spin spinning={showSpinner}>
        <Flex mt={3} flexDirection='column'>
          {productSets
            .filter(set => Boolean(set.data))
            .map(set => (
              <ProductSet
                onSeeAll={() => null}
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
