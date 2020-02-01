import React from 'react';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Flex,
  Image,
} from '@sradevski/blocks-ui';
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

  return (
    <Link href='/products/[pid]' as={`/products/${product._id}`}>
      <a style={{ textDecoration: 'none' }}>
        <Card
          hoverable
          width={['180px', '200px', '240px', '280px']}
          cover={
            <Flex
              mt={3}
              height={['90px', '120px', '140px', '180px']}
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
          <Flex flexDirection='column'>
            <Title mt={2} mb={0} level={4} ellipsis={{ rows: 2 }}>
              {product.name}
            </Title>
            <Price price={product.price} currency={'ден'} />
            {product.stock === 0 && (
              <Text type='danger'>{t('product.outOfStock')}</Text>
            )}
            <Paragraph
              style={{ whiteSpace: 'pre-wrap' }}
              mt={3}
              mb={0}
              ellipsis={{ rows: 3 }}
            >
              {product.description}
            </Paragraph>
          </Flex>
        </Card>
      </a>
    </Link>
  );
};
