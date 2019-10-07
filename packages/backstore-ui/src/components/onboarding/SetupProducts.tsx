import * as React from 'react';
import { Col, Row, Button, Flex, Title, Text } from '@lamk/blocks-ui';
import { AddProductCard } from './AddProductCard';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { Category } from '@lamk/la-sdk/dist/models/category';
import { GroupedCategories } from '../../state/modules/categories/categories.selector';

interface SetupProductsProps {
  products: Product[];
  categories: Category[] | null;
  groupedCategories: GroupedCategories | null;
  onDone: () => void;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

export const SetupProducts = ({
  products,
  categories,
  groupedCategories,
  onDone,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct,
}: SetupProductsProps) => {
  return (
    <>
      <Flex mb={5} alignItems='center' flexDirection='column'>
        <Title level={3}>
          Let's add some products
          <Button mx={3} size='large' onClick={onDone} type='primary'>
            Continue
          </Button>
        </Title>
        <Text type='secondary'>
          Don't worry, you can modify things later as well.
        </Text>
      </Flex>
      <Row
        type='flex'
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
                onAddProduct={onAddProduct}
                onPatchProduct={onPatchProduct}
                onRemoveProduct={onRemoveProduct}
              />
            </Col>
          );
        })}

        <Col mb={4}>
          <AddProductCard
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
