import * as React from 'react';
import { Col, Row } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { AddProductCard } from '../shared/AddProductCard';
import { Flex } from '../../component-lib/basic/Flex';
import { Product } from '../../sdk/models/product';

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
    <Row type='flex' align='middle' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      {products.map(product => {
        return (
          <Col>
            <AddProductCard
              product={product}
              onAddProduct={onAddProduct}
              onPatchProduct={onPatchProduct}
              onRemoveProduct={onRemoveProduct}
            />
          </Col>
        );
      })}

      <Col>
        <AddProductCard
          onAddProduct={onAddProduct}
          onPatchProduct={onPatchProduct}
          onRemoveProduct={onRemoveProduct}
        />
      </Col>
      <Col>
        <Flex
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          width={390}
          my={4}
        >
          <Button size='large' width='60%' icon={'plus'} type='primary'>
            Add Another Product
          </Button>
          <Button
            onClick={onDone}
            type='default'
            size='large'
            width='60%'
            mt={3}
          >
            Next
          </Button>
        </Flex>
      </Col>
    </Row>
  );
};
