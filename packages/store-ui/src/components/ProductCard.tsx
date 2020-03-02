import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { Card, Title, Text, Flex, Image, hooks } from '@sradevski/blocks-ui';
import Link from 'next/link';
import { Price } from './shared/Price';
import { useTranslation } from '../common/i18n';

export const ProductCard = ({
  product,
  storeId,
}: {
  product: Product;
  storeId: string;
}) => {
  const { t } = useTranslation();
  const cardSize = hooks.useBreakpoint<'small' | 'default'>([
    'small',
    'default',
    'default',
  ]);

  return (
    <Link href='/products/[pid]' as={`/products/${product._id}`}>
      <a style={{ textDecoration: 'none' }}>
        <Card
          size={cardSize}
          hoverable
          width={['160px', '240px', '280px']}
          cover={
            <Flex
              mt={3}
              height={['100px', '140px', '180px']}
              justifyContent='center'
              alignItems='center'
            >
              <Image
                height='100%'
                src={sdk.artifact.getUrlForArtifact(product.images[0], storeId)}
                alt={product.name}
              />
            </Flex>
          }
        >
          <Flex height={80} flexDirection='column'>
            <Title mt={2} mb={0} level={4} ellipsis={{ rows: 2 }}>
              {product.name}
            </Title>
            {product.stock === 0 && (
              <Text type='danger'>{t('product.outOfStock')}</Text>
            )}
          </Flex>
          <Price
            calculatedPrice={product.calculatedPrice}
            basePrice={product.price}
            currency={'ден'}
          />
        </Card>
      </a>
    </Link>
  );
};
