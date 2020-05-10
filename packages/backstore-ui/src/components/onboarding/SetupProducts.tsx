import * as React from 'react';
import { Col, Row, Button, Flex, Title, Text } from '@sradevski/blocks-ui';
import { AddProductCard } from './AddProductCard';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { GroupedCategories } from '../../state/modules/categories/categories.selector';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';

interface SetupProductsProps {
  storeId: Store['_id'] | undefined;
  products: Product[];
  categories: Category[] | null;
  groupedCategories: GroupedCategories | null;
  onDone: () => void;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

export const SetupProducts = ({
  storeId,
  products,
  categories,
  groupedCategories,
  onDone,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct,
}: SetupProductsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex mb={6} alignItems='center' flexDirection='column'>
        <Title level={3}>
          {t('onboarding.setupProductTitle')}
          <Button mx={3} size='large' onClick={onDone} type='primary'>
            {t('actions.continue')}
          </Button>
        </Title>
        <Text type='secondary'>{t('onboarding.setupProductSubtitle')}</Text>
      </Flex>
      <Row
        align='top'
        justify='start'
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      >
        {products.map(product => {
          return (
            <Col key={product._id} mb={4}>
              <AddProductCard
                storeId={storeId}
                product={product}
                categories={categories}
                groupedCategories={groupedCategories}
                onAddProduct={onAddProduct}
                onPatchProduct={onPatchProduct}
                onRemoveProduct={onRemoveProduct}
              />
            </Col>
          );
        })}

        <Col mb={4}>
          <AddProductCard
            storeId={storeId}
            product={undefined}
            categories={categories}
            groupedCategories={groupedCategories}
            onAddProduct={onAddProduct}
            onPatchProduct={onPatchProduct}
            onRemoveProduct={onRemoveProduct}
          />
        </Col>
      </Row>
    </>
  );
};
