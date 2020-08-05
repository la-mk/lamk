import * as React from 'react';
import { Col, Row, Button, Flex, Title, Text } from '@sradevski/blocks-ui';
import { AddProductCard } from './AddProductCard';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { GroupedCategories } from '../../state/modules/categories/categories.selector';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';

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
  const [editedProduct, setEditedProduct] = React.useState<
    Partial<Product> | undefined
  >({
    soldBy: storeId,
    unit: sdk.product.ProductUnit.ITEM,
    images: [],
    groups: [],
    variants: [{ price: 0 }],
  });

  // This is a messy way of recreating the "AddProductCard" component when we add a product.
  React.useEffect(() => {
    if (!editedProduct) {
      setEditedProduct({
        soldBy: storeId,
        unit: sdk.product.ProductUnit.ITEM,
        images: [],
        groups: [],
        variants: [],
      });
    }
  }, [editedProduct, setEditedProduct]);

  return (
    <>
      <Flex mb={6} alignItems='center' flexDirection='column'>
        <Title level={3}>
          {t('onboarding.setupProductTitle')}
          <Button mx={3} size='large' onClick={onDone} type='primary'>
            {t('actions.continue')}
          </Button>
        </Title>
        <Text color='secondary'>{t('onboarding.setupProductSubtitle')}</Text>
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
                product={product}
                categories={categories}
                groupedCategories={groupedCategories}
                onPatchProduct={onPatchProduct}
                onRemoveProduct={onRemoveProduct}
              />
            </Col>
          );
        })}

        <Col mb={4}>
          {editedProduct && (
            <AddProductCard
              product={editedProduct as Product}
              categories={categories}
              groupedCategories={groupedCategories}
              onAddProduct={product => {
                setEditedProduct(undefined);
                onAddProduct(product);
              }}
              onPatchProduct={onPatchProduct}
              onRemoveProduct={onRemoveProduct}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
