import React from 'react';
import { ProductSet } from '../sets/ProductSet';
import { CategoriesList } from '../CategoriesList';
import styled from 'styled-components';
import { Flex } from '@lamk/blocks-ui';
import { useTranslation } from '../../common/i18n';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { StoreContents } from '@lamk/la-sdk/dist/models/storeContents';
import { sdk } from '@lamk/la-sdk';

const Banner = styled.div`
  position: relative;
`;

const ImageBanner = styled.img`
  object-fit: contain;
  width: 100%;
  height: auto;
`;

export const Home = ({
  products,
  landingContent,
}: {
  products: Product[];
  landingContent: StoreContents['landing'];
}) => {
  const { t } = useTranslation();

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
      <Flex mt={3} flexDirection='column'>
        <ProductSet products={products} title={t('productSet.newArrivals')} />
      </Flex>
    </>
  );
};
