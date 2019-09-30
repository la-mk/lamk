import * as React from 'react';
import { Col, Row, Button, Flex, Title, Text } from 'blocks-ui';
import { AddProductCard } from './AddProductCard';
import { Product } from 'la-sdk/dist/models/product';

interface SetupProductsProps {
  products: Product[];
  onDone: () => void;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

export const SetupProducts = ({
  products,
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
            onAddProduct={onAddProduct}
            onPatchProduct={onPatchProduct}
            onRemoveProduct={onRemoveProduct}
          />
        </Col>
      </Row>
    </>
  );
};
