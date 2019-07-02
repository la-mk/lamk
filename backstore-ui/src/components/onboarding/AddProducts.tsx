import * as React from 'react';
import { Col, Row } from '../../component-lib/basic/Grid';
import { Button } from '../../component-lib/basic/Button';
import { CreateProductCard } from './CreateProductCard';

export const AddProducts = ({ onDone }: any) => {
  return (
    <Row type='flex' align='middle' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col>
        <CreateProductCard />
      </Col>
      <Col width='390px'>
        <Button my={4} icon={'plus'}>
          Add Product
        </Button>
      </Col>
    </Row>
  );
};
